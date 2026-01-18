import { supabaseAdmin } from "./supabaseClient"

const STORAGE_BUCKET = process.env.STORAGE_BUCKET || "moods-audio"

export const storageBucket = {
  async getPublicUrl(path: string): Promise<string> {
    if (!path) return ""

    // Prefer signed URL to handle private buckets and consistent access.
    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(path, 60 * 60)

    if (!signedError && signedData?.signedUrl) {
      return signedData.signedUrl
    }

    const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return data?.publicUrl || ""
  },
}
