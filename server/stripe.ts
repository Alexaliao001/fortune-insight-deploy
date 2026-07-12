import Stripe from "stripe";
import { Router, raw } from "express";
import { ENV } from "./_core/env";
import { PRODUCTS, ProductId, calculateCharityAmount } from "./products";
import { getDb, addPurchaseCredits } from "./db";
import { memberships, charityDonations, orders } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";
import { nanoid } from "nanoid";
import { createNotification } from "./routers/notification";

// Lazy Stripe init — empty string throws at module load and breaks tests/dev without Stripe.
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    if (!ENV.stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(ENV.stripeSecretKey);
  }
  return _stripe;
}

export const stripeRouter = Router();

// Webhook处理 - 必须在express.json()之前注册
stripeRouter.post("/webhook", raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = ENV.stripeWebhookSecret;

  if (!sig || !webhookSecret) {
    console.error("[Webhook] Missing signature or webhook secret");
    return res.status(400).send("Missing signature or webhook secret");
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // 处理测试事件
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error(`[Webhook] Error processing ${event.type}:`, error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// 处理结账完成
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const productId = session.metadata?.product_id as ProductId | undefined;
  const customerEmail = session.metadata?.customer_email;

  if (!userId || !productId) {
    console.error("[Webhook] Missing user_id or product_id in session metadata");
    return;
  }

  const db = await getDb();
  if (!db) return;

  const product = PRODUCTS[productId];
  if (!product) {
    console.error(`[Webhook] Unknown product: ${productId}`);
    return;
  }

  const amountPaid = session.amount_total || product.price;
  const charityAmount = calculateCharityAmount(productId, amountPaid);

  // 创建订单记录
  const orderNo = `ORD${Date.now()}${nanoid(6)}`;
  const productTypeMap: Record<string, "tarot_detail" | "bazi_detail" | "dream_detail" | "compatibility" | "membership_monthly" | "membership_yearly" | "membership_lifetime"> = {
    MONTHLY_MEMBERSHIP: "membership_monthly",
    YEARLY_MEMBERSHIP: "membership_yearly",
    LIFETIME_MEMBERSHIP: "membership_lifetime",
    TAROT_DEEP_READING: "tarot_detail",
    TAROT_SINGLE: "tarot_detail",
    TAROT_PACK_3: "tarot_detail",
    BAZI_FULL_REPORT: "bazi_detail",
    BAZI_SINGLE: "bazi_detail",
    DREAM_SINGLE: "dream_detail",
    DREAM_PACK_5: "dream_detail",
  };

  const [orderResult] = await db.insert(orders).values({
    userId: parseInt(userId),
    orderNo,
    productType: productTypeMap[productId] || "membership_monthly",
    amount: (amountPaid / 100).toFixed(2),
    charityAmount: (charityAmount / 100).toFixed(2),
    paymentStatus: "paid",
    transactionId: session.id,
    paidAt: new Date(),
  });

  const orderId = orderResult.insertId;

  // 判断是会员订阅还是单次购买
  const isMembership = productId.includes("MEMBERSHIP");
  const isSinglePurchase = 'featureType' in product;

  if (isMembership) {
    // 创建会员记录
    const now = new Date();
    let expiresAt: Date | null = null;

    if (product.interval === "month") {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (product.interval === "year") {
      expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    }

    await db.insert(memberships).values({
      userId: parseInt(userId),
      type: productId.includes("lifetime") ? "lifetime" : productId.includes("yearly") ? "yearly" : "monthly",
      status: "active",
      stripeCustomerId: session.customer as string || null,
      stripeSubscriptionId: session.subscription as string || null,
      startDate: now,
      endDate: expiresAt,
      autoRenew: product.interval !== "one_time",
      price: (amountPaid / 100).toFixed(2),
      charityAmount: (charityAmount / 100).toFixed(2),
    });
  } else if (isSinglePurchase) {
    // 发放单次购买凭证
    const singleProduct = product as { featureType: string; credits: number };
    await addPurchaseCredits(
      parseInt(userId),
      singleProduct.featureType,
      singleProduct.credits,
      session.id
    );
  }

  // 记录公益捐赠
  await db.insert(charityDonations).values({
    orderId: orderId,
    userId: parseInt(userId),
    amount: (charityAmount / 100).toFixed(2),
    projectName: "社会公益基金",
    status: "pending",
  });

  // 通知网站所有者
  const purchaseType = isMembership ? "会员订阅" : "单次购买";
  await notifyOwner({
    title: `🎉 新${purchaseType}`,
    content: `用户 ${customerEmail || userId} 购买了 ${product.name}，支付金额 $${(amountPaid / 100).toFixed(2)}，其中 $${(charityAmount / 100).toFixed(2)} 将捐赠给公益项目。`,
  });

  // Send in-app notification to user
  const userIdNum = parseInt(userId);
  if (isMembership) {
    await createNotification({
      userId: userIdNum,
      type: "membership",
      title: "Welcome to Premium!",
      message: `Your ${product.name} is now active. Enjoy unlimited access to all features!`,
      link: "/membership",
      icon: "crown",
    });
  } else {
    await createNotification({
      userId: userIdNum,
      type: "report",
      title: "Purchase Confirmed",
      message: `Your ${product.name} credits are ready to use. Start your reading now!`,
      link: "/profile",
      icon: "file",
    });
  }

  console.log(`[Webhook] ${purchaseType} created for user ${userId}, product: ${productId}`);
}

// 处理订阅更新
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) return;

  const customerId = subscription.customer as string;
  
  // 根据Stripe客户ID查找会员记录并更新状态
  const periodEnd = (subscription as unknown as { current_period_end?: number }).current_period_end;
  await db
    .update(memberships)
    .set({
      status: subscription.status === "active" ? "active" : "expired",
      endDate: periodEnd ? new Date(periodEnd * 1000) : undefined,
    })
    .where(eq(memberships.stripeCustomerId, customerId));

  console.log(`[Webhook] Subscription updated for customer ${customerId}`);
}

// 处理订阅取消
async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) return;

  const customerId = subscription.customer as string;

  await db
    .update(memberships)
    .set({
      status: "cancelled",
      autoRenew: false,
    })
    .where(eq(memberships.stripeCustomerId, customerId));

  // Notify user about cancellation
  const [cancelledMembership] = await db
    .select()
    .from(memberships)
    .where(eq(memberships.stripeCustomerId, customerId))
    .limit(1);
  if (cancelledMembership) {
    await createNotification({
      userId: cancelledMembership.userId,
      type: "membership",
      title: "Subscription Cancelled",
      message: "Your membership has been cancelled. You can resubscribe anytime to regain access.",
      link: "/membership",
      icon: "crown",
    });
  }

  console.log(`[Webhook] Subscription canceled for customer ${customerId}`);
}

// 处理发票支付成功
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const amountPaid = invoice.amount_paid;

  // 计算并记录公益捐赠
  const charityAmount = Math.floor(amountPaid * 0.1);

  const db = await getDb();
  if (!db) return;

  // 查找用户
  const [membership] = await db
    .select()
    .from(memberships)
    .where(eq(memberships.stripeCustomerId, customerId))
    .limit(1);

  if (membership) {
    // 创建订单记录
    const orderNo = `ORD${Date.now()}${nanoid(6)}`;
    const [orderResult] = await db.insert(orders).values({
      userId: membership.userId,
      orderNo,
      productType: "membership_monthly",
      amount: (amountPaid / 100).toFixed(2),
      charityAmount: (charityAmount / 100).toFixed(2),
      paymentMethod: "wechat",
      paymentStatus: "paid",
      transactionId: invoice.id,
      paidAt: new Date(),
    });

    await db.insert(charityDonations).values({
      orderId: orderResult.insertId,
      userId: membership.userId,
      amount: (charityAmount / 100).toFixed(2),
      projectName: "社会公益基金",
      status: "pending",
    });

    // 通知所有者
    await notifyOwner({
      title: "💝 公益捐赠记录",
      content: `会员续费成功，金额 ¥${(amountPaid / 100).toFixed(2)}，其中 ¥${(charityAmount / 100).toFixed(2)} 将捐赠给公益项目。`,
    });
  }

  console.log(`[Webhook] Invoice paid for customer ${customerId}, amount: ${amountPaid}`);
}

// 创建结账会话的辅助函数
export async function createCheckoutSession(
  userId: number,
  userEmail: string,
  userName: string,
  productId: ProductId,
  origin: string
): Promise<string> {
  const product = PRODUCTS[productId];
  
  if (!product) {
    throw new Error(`Unknown product: ${productId}`);
  }

  // 使用自动支付方式选择，Stripe会根据账户启用的支付方式和用户地理位置自动显示
  // 支持的支付方式包括：Cards, Apple Pay, Link, Alipay, WeChat Pay 等
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    // 不指定 payment_method_types，让 Stripe 自动选择最合适的支付方式
    // 这样会根据 Dashboard 中启用的支付方式自动显示 Alipay、WeChat Pay 等
    mode: product.interval === "one_time" ? "payment" : "subscription",
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName,
      product_id: productId,
    },
    success_url: `${origin}/membership?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/membership?canceled=true`,
    allow_promotion_codes: true,
    // 为微信支付设置客户端类型
    payment_method_options: {
      wechat_pay: {
        client: "web",
      },
      alipay: {},
    },
  };

  if (product.interval === "one_time") {
    sessionParams.line_items = [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ];
  } else {
    sessionParams.line_items = [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price,
          recurring: {
            interval: product.interval as "month" | "year",
          },
        },
        quantity: 1,
      },
    ];
  }

  const session = await getStripe().checkout.sessions.create(sessionParams);
  
  if (!session.url) {
    throw new Error("Failed to create checkout session URL");
  }

  return session.url;
}
