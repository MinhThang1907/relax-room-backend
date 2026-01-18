import { supabaseAdmin } from "../lib/supabaseClient"
import type { Mood } from "../domain/types"
import { MoodSchema } from "../domain/schemas"

export class MoodRepository {
  async getActiveMoods(): Promise<Mood[]> {
    const { data, error } = await supabaseAdmin
      .from("moods")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[MoodRepository] Error fetching moods:", error)
      throw new Error("Không thể lấy danh sách mood")
    }

    return data?.map((mood) => MoodSchema.parse(mood)) || []
  }

  async getMoodById(moodId: string): Promise<Mood | null> {
    const { data, error } = await supabaseAdmin
      .from("moods")
      .select("*")
      .eq("id", moodId)
      .eq("is_active", true)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // Not found
      }
      console.error("[MoodRepository] Error fetching mood:", error)
      throw new Error("Không thể lấy mood")
    }

    return MoodSchema.parse(data)
  }
}

export const moodRepository = new MoodRepository()
