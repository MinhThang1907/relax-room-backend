import { supabaseAdmin } from "../lib/supabaseClient"
import type { Room, RoomStatus } from "../domain/types"
import { RoomSchema } from "../domain/schemas"

export class RoomRepository {
  async createRoom(moodId: string, durationMinutes: number, hostUserId: string): Promise<Room> {
    const { data, error } = await supabaseAdmin
      .from("rooms")
      .insert([
        {
          mood_id: moodId,
          duration_minutes: durationMinutes,
          status: "LOBBY",
          host_user_id: hostUserId,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[RoomRepository] Error creating room:", error)
      throw new Error("Không thể tạo phòng")
    }

    return RoomSchema.parse(data)
  }

  async getRoomById(roomId: string): Promise<Room | null> {
    const { data, error } = await supabaseAdmin.from("rooms").select("*").eq("id", roomId).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // Not found
      }
      console.error("[RoomRepository] Error fetching room:", error)
      throw new Error("Không thể lấy phòng")
    }

    return RoomSchema.parse(data)
  }

  async updateRoomStatus(roomId: string, status: RoomStatus): Promise<Room> {
    const { data, error } = await supabaseAdmin.from("rooms").update({ status }).eq("id", roomId).select().single()

    if (error) {
      console.error("[RoomRepository] Error updating room status:", error)
      throw new Error("Không thể cập nhật trạng thái phòng")
    }

    return RoomSchema.parse(data)
  }

  async startRoom(roomId: string, durationMinutes: number): Promise<Room> {
    const now = new Date()
    const endsAt = new Date(now.getTime() + durationMinutes * 60 * 1000)

    const { data, error } = await supabaseAdmin
      .from("rooms")
      .update({
        status: "RUNNING",
        started_at: now.toISOString(),
        ends_at: endsAt.toISOString(),
      })
      .eq("id", roomId)
      .select()
      .single()

    if (error) {
      console.error("[RoomRepository] Error starting room:", error)
      throw new Error("Không thể bắt đầu phòng")
    }

    return RoomSchema.parse(data)
  }

  async endRoom(roomId: string): Promise<Room> {
    const { data, error } = await supabaseAdmin
      .from("rooms")
      .update({ status: "ENDED" })
      .eq("id", roomId)
      .select()
      .single()

    if (error) {
      console.error("[RoomRepository] Error ending room:", error)
      throw new Error("Không thể kết thúc phòng")
    }

    return RoomSchema.parse(data)
  }
}

export const roomRepository = new RoomRepository()
