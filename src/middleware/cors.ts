import cors from "cors"

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-guest-id"],
}

export const corsMiddleware = cors(corsOptions)
