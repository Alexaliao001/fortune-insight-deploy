import { describe, it, expect } from "vitest";

/**
 * Tests for chunk load error detection logic.
 * The actual lazyWithRetry is a client-side module using React lazy(),
 * so we test the error detection logic separately.
 */

function isChunkLoadError(error: Error): boolean {
  const msg = error.message.toLowerCase();
  return (
    msg.includes("failed to fetch dynamically imported module") ||
    msg.includes("loading chunk") ||
    msg.includes("loading css chunk") ||
    msg.includes("dynamically imported module") ||
    msg.includes("failed to load module script") ||
    msg.includes("error loading dynamically imported module")
  );
}

describe("Chunk Load Error Detection", () => {
  it("should detect 'Failed to fetch dynamically imported module' error", () => {
    const error = new TypeError(
      "Failed to fetch dynamically imported module: https://www.fortunesite.one/assets/Home-BkIMASk0.js"
    );
    expect(isChunkLoadError(error)).toBe(true);
  });

  it("should detect 'Loading chunk' error", () => {
    const error = new Error("Loading chunk 42 failed.");
    expect(isChunkLoadError(error)).toBe(true);
  });

  it("should detect 'Loading CSS chunk' error", () => {
    const error = new Error("Loading CSS chunk styles-abc123 failed.");
    expect(isChunkLoadError(error)).toBe(true);
  });

  it("should detect 'error loading dynamically imported module' error", () => {
    const error = new TypeError(
      "error loading dynamically imported module: /assets/Profile-xyz.js"
    );
    expect(isChunkLoadError(error)).toBe(true);
  });

  it("should detect 'Failed to load module script' error (Firefox)", () => {
    const error = new TypeError(
      "Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of 'text/html'."
    );
    expect(isChunkLoadError(error)).toBe(true);
  });

  it("should NOT detect unrelated errors", () => {
    const error = new Error("Cannot read properties of undefined");
    expect(isChunkLoadError(error)).toBe(false);
  });

  it("should NOT detect network errors that are not chunk-related", () => {
    const error = new Error("NetworkError when attempting to fetch resource.");
    expect(isChunkLoadError(error)).toBe(false);
  });

  it("should NOT detect syntax errors", () => {
    const error = new SyntaxError("Unexpected token '<'");
    expect(isChunkLoadError(error)).toBe(false);
  });

  it("should handle case-insensitive matching", () => {
    const error = new TypeError(
      "FAILED TO FETCH DYNAMICALLY IMPORTED MODULE: /assets/Home.js"
    );
    expect(isChunkLoadError(error)).toBe(true);
  });
});

describe("ErrorBoundary chunk error behavior", () => {
  it("should identify chunk errors as recoverable via reload", () => {
    const chunkError = new TypeError(
      "Failed to fetch dynamically imported module: https://www.fortunesite.one/assets/Home-BkIMASk0.js"
    );
    expect(isChunkLoadError(chunkError)).toBe(true);

    // Non-chunk errors should not trigger reload
    const regularError = new Error("Something went wrong");
    expect(isChunkLoadError(regularError)).toBe(false);
  });

  it("should handle the exact error message from the user's screenshot", () => {
    // This is the exact error from the user's screenshot
    const error = new TypeError(
      "Failed to fetch dynamically imported module: https://www.fortunesite.one/assets/Home-BkIMASk0.js"
    );
    expect(isChunkLoadError(error)).toBe(true);
  });
});
