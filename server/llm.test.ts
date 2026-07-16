import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ENV } from "./_core/env";
import { invokeLLM, type InvokeResult } from "./_core/llm";

const result: InvokeResult = {
  id: "chatcmpl-test",
  created: 1,
  model: "test-model",
  choices: [
    {
      index: 0,
      message: { role: "assistant", content: "ok" },
      finish_reason: "stop",
    },
  ],
};

const okResponse = () =>
  new Response(JSON.stringify(result), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

const originalEnv = { ...ENV };

describe("invokeLLM provider configuration", () => {
  beforeEach(() => {
    Object.assign(ENV, originalEnv, {
      llmApiUrl: "https://provider.example/v1",
      llmApiKey: "llm-key",
      llmModel: "custom-model",
      llmDailyMaxCalls: "10000",
      forgeApiUrl: "https://forge.example",
      forgeApiKey: "forge-key",
    });
  });

  afterEach(() => {
    Object.assign(ENV, originalEnv);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("prefers LLM env values and omits Forge-only thinking", async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse());
    vi.stubGlobal("fetch", fetchMock);

    await invokeLLM({ messages: [{ role: "user", content: "hello" }] });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));

    expect(url).toBe("https://provider.example/v1/chat/completions");
    expect(init.headers).toMatchObject({ authorization: "Bearer llm-key" });
    expect(body).toMatchObject({ model: "custom-model" });
    expect(body).not.toHaveProperty("thinking");
  });

  it("falls back to BUILT_IN_FORGE values and keeps Forge thinking", async () => {
    Object.assign(ENV, {
      llmApiUrl: "",
      llmApiKey: "",
      llmModel: "",
      forgeApiUrl: "https://forge.manus.im",
      forgeApiKey: "forge-key",
    });
    const fetchMock = vi.fn().mockResolvedValue(okResponse());
    vi.stubGlobal("fetch", fetchMock);

    await invokeLLM({ messages: [{ role: "user", content: "hello" }] });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));

    expect(url).toBe("https://forge.manus.im/v1/chat/completions");
    expect(init.headers).toMatchObject({ authorization: "Bearer forge-key" });
    expect(body).toMatchObject({
      model: "gemini-2.5-flash",
      thinking: { budget_tokens: 128 },
    });
  });

  it("aborts a timed-out attempt after 60 seconds and retries once", async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(
        (_url: string, init: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init.signal?.addEventListener("abort", () => {
              const error = new Error("aborted");
              error.name = "AbortError";
              reject(error);
            });
          })
      )
      .mockResolvedValueOnce(okResponse());
    vi.stubGlobal("fetch", fetchMock);

    const pending = invokeLLM({
      messages: [{ role: "user", content: "hello" }],
    });
    await vi.advanceTimersByTimeAsync(60_000);

    await expect(pending).resolves.toEqual(result);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns structured degradation without calling the provider when the daily cap is reached", async () => {
    Object.assign(ENV, { llmDailyMaxCalls: "0" });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const degraded = await invokeLLM({
      language: "en",
      messages: [{ role: "user", content: "hello" }],
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(degraded.degradation).toMatchObject({
      code: "LLM_DAILY_LIMIT",
      source: "daily_limit",
      dailyLimit: 0,
    });
    expect(degraded.choices[0]?.message.content).toContain(
      "Today's AI interpretation quota has been reached"
    );
  });
});
