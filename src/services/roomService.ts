import { roomRepository } from "../repositories/roomRepository"
import { roomParticipantRepository } from "../repositories/roomParticipantRepository"
import { moodRepository } from "../repositories/moodRepository"
import { storageRepository } from "../repositories/storageRepository"
import type { RoomDetailResponse } from "../domain/types"
import { AppError } from "../middleware/errorHandler"

export class RoomService {
  async createRoom(moodId: string, durationMinutes: number, hostUserId: string) {
    // Validate mood exists
    const mood = await moodRepository.getMoodById(moodId)
    if (!mood) {
      throw new AppError(404, "MOOD_NOT_FOUND", "Không tìm thấy mood")
    }

    const room = await roomRepository.createRoom(moodId, durationMinutes, hostUserId)
    return { roomId: room.id }
  }

  async getRoomDetail(roomId: string): Promise<RoomDetailResponse> {
    const room = await roomRepository.getRoomById(roomId)

    if (!room) {
      throw new AppError(404, "ROOM_NOT_FOUND", "Không tìm thấy phòng")
    }

    const mood = await moodRepository.getMoodById(room.mood_id)
    if (!mood) {
      throw new AppError(404, "MOOD_NOT_FOUND", "Không tìm thấy mood của phòng")
    }

    const participants = await roomParticipantRepository.getRoomParticipants(roomId)
    const audioUrl = await storageRepository.getPublicUrl("moods-audio", mood.audio_path)

    return {
      room: {
        id: room.id,
        moodId: room.mood_id,
        durationMinutes: room.duration_minutes,
        status: room.status,
        hostUserId: room.host_user_id,
        createdAt: room.created_at,
        startedAt: room.started_at,
        endsAt: room.ends_at,
      },
      mood: {
        id: mood.id,
        name: mood.name,
        description: mood.description,
        tags: mood.tags,
        audioUrl,
      },
      participants: participants.map((p) => ({
        userId: p.user_id,
        joinedAt: p.joined_at,
      })),
    }
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await roomRepository.getRoomById(roomId)
    if (!room) {
      throw new AppError(404, "ROOM_NOT_FOUND", "Không tìm thấy phòng")
    }

    if (room.status === "ENDED") {
      throw new AppError(400, "ROOM_ENDED", "Phòng này đã kết thúc")
    }

    await roomParticipantRepository.joinRoom(roomId, userId)
    return { success: true }
  }

  async startRoom(roomId: string, requestUserId: string) {
    const room = await roomRepository.getRoomById(roomId)

    if (!room) {
      throw new AppError(404, "ROOM_NOT_FOUND", "Không tìm thấy phòng")
    }

    if (room.host_user_id !== requestUserId) {
      throw new AppError(403, "NOT_HOST", "Bạn không phải chủ phòng")
    }

    if (room.status !== "LOBBY") {
      throw new AppError(400, "INVALID_STATE", "Phòng phải ở trạng thái LOBBY")
    }

    await roomRepository.startRoom(roomId, room.duration_minutes)
    return { success: true }
  }

  async endRoom(roomId: string) {
    const room = await roomRepository.getRoomById(roomId)

    if (!room) {
      throw new AppError(404, "ROOM_NOT_FOUND", "Không tìm thấy phòng")
    }

    if (room.status === "ENDED") {
      return { success: true } // Idempotent
    }

    await roomRepository.endRoom(roomId)
    return { success: true }
  }
}

export const roomService = new RoomService()
