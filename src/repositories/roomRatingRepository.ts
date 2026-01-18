import { supabaseAdmin } from "../lib/supabaseClient"
import type { RoomRating, RatingType } from "../domain/types"
import { RoomRatingSchema } from "../domain/schemas"

export class RoomRatingRepository {
  async upsertRating(roomId: string, userId: string, rating: RatingType): Promise<RoomRating> {
    const { data, error } = await supabaseAdmin
      .from("room_ratings")
      .upsert([
        {
          room_id: roomId,
          user_id: userId,
          rating,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[RoomRatingRepository] Error upserting rating:", error)
      throw new Error("Không thể lưu đánh giá")
    }

    return RoomRatingSchema.parse(data)
  }

  async getRoomRatings(roomId: string): Promise<RoomRating[]> {
    const { data, error } = await supabaseAdmin.from("room_ratings").select("*").eq("room_id", roomId)

    if (error) {
      console.error("[RoomRatingRepository] Error fetching ratings:", error)
      throw new Error("Không thể lấy danh sách đánh giá")
    }

    return data?.map((r) => RoomRatingSchema.parse(r)) || []
  }
}

export const roomRatingRepository = new RoomRatingRepository()
