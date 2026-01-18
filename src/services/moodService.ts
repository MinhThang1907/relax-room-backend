import { moodRepository } from "../repositories/moodRepository"
import { storageRepository } from "../repositories/storageRepository"
import type { MoodResponse } from "../domain/types"
import { AppError } from "../middleware/errorHandler"

export class MoodService {
  async getActiveMoods(): Promise<MoodResponse[]> {
    const moods = await moodRepository.getActiveMoods()

    const moodyWithUrls = await Promise.all(
      moods.map(async (mood) => ({
        id: mood.id,
        name: mood.name,
        description: mood.description,
        tags: mood.tags,
        audioUrl: await storageRepository.getPublicUrl("moods-audio", mood.audio_path),
      })),
    )

    return moodyWithUrls
  }

  async getMoodById(moodId: string): Promise<MoodResponse> {
    const mood = await moodRepository.getMoodById(moodId)

    if (!mood) {
      throw new AppError(404, "MOOD_NOT_FOUND", "Không tìm thấy mood")
    }

    const audioUrl = await storageRepository.getPublicUrl("moods-audio", mood.audio_path)

    return {
      id: mood.id,
      name: mood.name,
      description: mood.description,
      tags: mood.tags,
      audioUrl,
    }
  }
}

export const moodService = new MoodService()
