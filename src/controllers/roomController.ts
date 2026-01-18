import type { Request, Response, NextFunction } from "express"
import { CreateRoomRequestSchema, RatingRequestSchema } from "../domain/schemas"
import { roomService } from "../services/roomService"
import { ratingService } from "../services/ratingService"
import { sendSuccess } from "../utils/response"

export class RoomController {
  async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const guestId = (req as any).guestId
      const body = CreateRoomRequestSchema.parse(req.body)

      const result = await roomService.createRoom(body.moodId, body.durationMinutes, guestId)

      sendSuccess(res, result, 201)
    } catch (error) {
      next(error)
    }
  }

  async getRoomDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params
      const detail = await roomService.getRoomDetail(roomId)
      sendSuccess(res, detail)
    } catch (error) {
      next(error)
    }
  }

  async joinRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const guestId = (req as any).guestId
      const { roomId } = req.params

      const result = await roomService.joinRoom(roomId, guestId)
      sendSuccess(res, result)
    } catch (error) {
      next(error)
    }
  }

  async startRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const guestId = (req as any).guestId
      const { roomId } = req.params

      const result = await roomService.startRoom(roomId, guestId)
      sendSuccess(res, result)
    } catch (error) {
      next(error)
    }
  }

  async endRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params
      const result = await roomService.endRoom(roomId)
      sendSuccess(res, result)
    } catch (error) {
      next(error)
    }
  }

  async rateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const guestId = (req as any).guestId
      const { roomId } = req.params
      const body = RatingRequestSchema.parse(req.body)

      const result = await ratingService.rateRoom(roomId, guestId, body.rating)
      sendSuccess(res, result)
    } catch (error) {
      next(error)
    }
  }
}

export const roomController = new RoomController()
