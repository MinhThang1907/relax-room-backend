import { supabaseAdmin } from "../lib/supabaseClient"
import type { RoomParticipant } from "../domain/types"
import { RoomParticipantSchema } from "../domain/schemas"

export class RoomParticipantRepository {
  async joinRoom(roomId: string, userId: string): Promise<RoomParticipant> {
    const { data, error } = await supabaseAdmin
      .from("room_participants")
      .upsert([
        {
          room_id: roomId,
          user_id: userId,
          joined_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[RoomParticipantRepository] Error joining room:", error)
      throw new Error("Không thể tham gia phòng")
    }

    return RoomParticipantSchema.parse(data)
  }

  async leaveRoom(roomId: string, userId: string): Promise<RoomParticipant> {
    const { data, error } = await supabaseAdmin
      .from("room_participants")
      .update({ left_at: new Date().toISOString() })
      .eq("room_id", roomId)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("[RoomParticipantRepository] Error leaving room:", error)
      throw new Error("Không thể rời phòng")
    }

    return RoomParticipantSchema.parse(data)
  }

  async getRoomParticipants(roomId: string): Promise<RoomParticipant[]> {
    const { data, error } = await supabaseAdmin
      .from("room_participants")
      .select("*")
      .eq("room_id", roomId)
      .is("left_at", null)
      .order("joined_at", { ascending: true })

    if (error) {
      console.error("[RoomParticipantRepository] Error fetching participants:", error)
      throw new Error("Không thể lấy danh sách tham gia viên")
    }

    return data?.map((p) => RoomParticipantSchema.parse(p)) || []
  }
}

export const roomParticipantRepository = new RoomParticipantRepository()
