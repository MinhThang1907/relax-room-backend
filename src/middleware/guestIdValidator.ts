import type { Request, Response, NextFunction } from "express"
import { AppError } from "./errorHandler"

export const guestIdValidator = (req: Request, res: Response, next: NextFunction) => {
  const guestId = req.headers["x-guest-id"] as string

  if (!guestId || !guestId.trim()) {
    throw new AppError(400, "MISSING_GUEST_ID", "Header x-guest-id là bắt buộc")
  }
  ;(req as any).guestId = guestId
  next()
}
