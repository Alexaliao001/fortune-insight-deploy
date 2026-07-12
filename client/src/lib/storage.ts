// 客户端存储上传工具
// 使用服务器端代理上传到S3

const FORGE_API_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL || "";
const FORGE_API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY || "";

function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

/**
 * 上传文件到存储
 * @param relKey 相对路径/文件名
 * @param data 文件数据 (Blob, File, ArrayBuffer, 或 string)
 * @param contentType MIME类型
 * @returns 上传后的URL
 */
export async function storagePut(
  relKey: string,
  data: Blob | File | ArrayBuffer | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  if (!FORGE_API_URL || !FORGE_API_KEY) {
    throw new Error("存储服务未配置");
  }

  const key = normalizeKey(relKey);
  const baseUrl = ensureTrailingSlash(FORGE_API_URL);
  
  // 构建上传URL
  const uploadUrl = new URL("v1/storage/upload", baseUrl);
  uploadUrl.searchParams.set("path", key);

  // 准备FormData
  const formData = new FormData();
  let blob: Blob;
  
  if (data instanceof Blob) {
    blob = data;
  } else if (data instanceof ArrayBuffer) {
    blob = new Blob([data], { type: contentType });
  } else if (typeof data === "string") {
    blob = new Blob([data], { type: contentType });
  } else {
    throw new Error("不支持的数据类型");
  }
  
  formData.append("file", blob, key.split("/").pop() ?? key);

  const response = await fetch(uploadUrl.toString(), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${FORGE_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`上传失败 (${response.status}): ${message}`);
  }

  const result = await response.json();
  return { key, url: result.url };
}

/**
 * 获取文件下载URL
 * @param relKey 相对路径/文件名
 * @returns 下载URL
 */
export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  if (!FORGE_API_URL || !FORGE_API_KEY) {
    throw new Error("存储服务未配置");
  }

  const key = normalizeKey(relKey);
  const baseUrl = ensureTrailingSlash(FORGE_API_URL);
  
  const downloadUrl = new URL("v1/storage/downloadUrl", baseUrl);
  downloadUrl.searchParams.set("path", key);

  const response = await fetch(downloadUrl.toString(), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${FORGE_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`获取下载URL失败: ${response.status}`);
  }

  const result = await response.json();
  return { key, url: result.url };
}
