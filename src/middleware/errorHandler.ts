import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import type { ApiResponse } from "../domain/types"

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Error]", err)

  // Zod validation error
  if (err instanceof ZodError) {
    const message = err.errors[0]?.message || "Dữ liệu không hợp lệ"
    const response: ApiResponse<null> = {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message,
      },
    }
    return res.status(400).json(response)
  }

  // Application error
  if (err instanceof AppError) {
    const response: ApiResponse<null> = {
      ok: false,
      error: {
        code: err.code,
        message: err.message,
      },
    }
    return res.status(err.statusCode).json(response)
  }

  // Unknown error
  const response: ApiResponse<null> = {
    ok: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Có lỗi xảy ra trên server",
    },
  }
  res.status(500).json(response)
}
