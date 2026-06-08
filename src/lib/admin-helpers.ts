import { supabase } from "@/integrations/supabase/client";

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // 10 years

export async function uploadGalleryFile(file: File, folder = "uploads"): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("gallery").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: sErr } = await supabase.storage.from("gallery").createSignedUrl(path, SIGNED_URL_TTL);
  if (sErr || !data) throw sErr ?? new Error("Failed to sign URL");
  return data.signedUrl;
}

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
