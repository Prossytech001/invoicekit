import {api} from "@/lib/api";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const TYPES = ["image/png", "image/jpeg", "image/webp"];

interface SignResponse {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
}

// 1) ask our backend for a signature  2) upload straight to Cloudinary  3) return the image URL
export async function uploadLogo(file: File): Promise<string> {
  if (!TYPES.includes(file.type)) throw new Error("Use a PNG, JPG or WebP image.");
  if (file.size > MAX_BYTES) throw new Error("Image is too large. Maximum size is 2 MB.");

  const sig = await api<SignResponse>("/uploads/sign", { method: "POST" });

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);
  form.append("allowed_formats", sig.allowedFormats);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: form });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.secure_url) throw new Error(body?.error?.message ?? "Upload failed. Please try again.");
  return body.secure_url as string;
}