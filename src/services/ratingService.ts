import { roomRatingRepository } from "../repositories/roomRatingRepository"
import { roomRepository } from "../repositories/roomRepository"
import type { RatingType } from "../domain/types"
import { AppError } from "../middleware/errorHandler"

export class RatingService {
  async rateRoom(roomId: string, userId: string, rating: RatingType) {
    const room = await roomRepository.getRoomById(roomId)

    if (!room) {
      throw new AppError(404, "ROOM_NOT_FOUND", "Không tìm thấy phòng")
    }

    await roomRatingRepository.upsertRating(roomId, userId, rating)
    return { success: true }
  }
}

export const ratingService = new RatingService()
