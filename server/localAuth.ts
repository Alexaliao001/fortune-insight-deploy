import { eq, sql } from "drizzle-orm";
import { getDb, grantSignupTrialIfNeeded } from "./db";
import { users } from "../drizzle/schema";
import {
  hashPassword,
  localOpenIdForEmail,
  normalizeEmail,
  verifyPassword,
} from "./password";
import { ENV } from "./_core/env";

let passwordColumnReady = false;

/** Ensure passwordHash column exists (Manus may skip migrations) */
export async function ensurePasswordColumn() {
  if (passwordColumnReady) return;
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(
      sql`ALTER TABLE users ADD COLUMN passwordHash varchar(255) NULL`
    );
  } catch {
    // Column already exists — ignore
  }
  passwordColumnReady = true;
}

export async function findUserByEmail(email: string) {
  await ensurePasswordColumn();
  const db = await getDb();
  if (!db) return null;
  const normalized = normalizeEmail(email);
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);
  return row ?? null;
}

export type RegisterResult =
  | { ok: true; user: typeof users.$inferSelect; isNew: true }
  | { ok: false; error: string };

export async function registerWithEmail(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<RegisterResult> {
  await ensurePasswordColumn();
  const db = await getDb();
  if (!db) return { ok: false, error: "Database unavailable" };

  const email = normalizeEmail(input.email);
  if (!email.includes("@") || email.length < 5) {
    return { ok: false, error: "Invalid email / 邮箱格式不正确" };
  }
  if (input.password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters / 密码至少 8 位" };
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    if (existing.passwordHash) {
      return { ok: false, error: "Email already registered / 该邮箱已注册，请直接登录" };
    }
    // OAuth-only account: attach password so they can use native login
    const passwordHash = await hashPassword(input.password);
    await db
      .update(users)
      .set({
        passwordHash,
        name: input.name?.trim() || existing.name,
        loginMethod: "email",
        lastSignedIn: new Date(),
      })
      .where(eq(users.id, existing.id));

    const [updated] = await db.select().from(users).where(eq(users.id, existing.id)).limit(1);
    if (!updated) return { ok: false, error: "Failed to update account" };
    await grantSignupTrialIfNeeded(updated.id);
    return { ok: true, user: updated, isNew: true };
  }

  const openId = localOpenIdForEmail(email);
  const passwordHash = await hashPassword(input.password);
  const name = input.name?.trim() || email.split("@")[0] || "User";

  // Owner can be granted admin if OWNER_OPEN_ID matches local openId or OWNER_EMAIL
  const ownerEmail = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();
  const isOwner =
    openId === ENV.ownerOpenId ||
    (!!ownerEmail && email === ownerEmail);

  await db.insert(users).values({
    openId,
    email,
    name,
    passwordHash,
    loginMethod: "email",
    role: isOwner ? "admin" : "user",
    lastSignedIn: new Date(),
  });

  const [created] = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  if (!created) return { ok: false, error: "Failed to create account" };

  await grantSignupTrialIfNeeded(created.id);
  return { ok: true, user: created, isNew: true };
}

export type LoginResult =
  | { ok: true; user: typeof users.$inferSelect }
  | { ok: false; error: string };

export async function loginWithEmail(input: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  await ensurePasswordColumn();
  const user = await findUserByEmail(input.email);
  if (!user) {
    return { ok: false, error: "Invalid email or password / 邮箱或密码错误" };
  }
  if (!user.passwordHash) {
    return {
      ok: false,
      error:
        "No password set for this email. Please register with the same email to set a password. / 该邮箱尚未设置密码，请用同一邮箱注册并设置密码。",
    };
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    return { ok: false, error: "Invalid email or password / 邮箱或密码错误" };
  }

  const db = await getDb();
  if (db) {
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));
  }

  await grantSignupTrialIfNeeded(user.id);
  return { ok: true, user };
}
