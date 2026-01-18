import type { Request, Response, NextFunction } from "express"
import { moodService } from "../services/moodService"
import { sendSuccess } from "../utils/response"

export class MoodController {
  async getActiveMoods(req: Request, res: Response, next: NextFunction) {
    try {
      const moods = await moodService.getActiveMoods()
      sendSuccess(res, moods)
    } catch (error) {
      next(error)
    }
  }

  async getMoodById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const mood = await moodService.getMoodById(id)
      sendSuccess(res, mood)
    } catch (error) {
      next(error)
    }
  }
}

export const moodController = new MoodController()
