import { Router } from "express"
import { guestIdValidator } from "../middleware/guestIdValidator"
import { roomController } from "../controllers/roomController"
import { streamController } from "../controllers/streamController"

const router = Router()

// Create room (requires guestId)
router.post("/", guestIdValidator, (req, res, next) => roomController.createRoom(req, res, next))

// Get room detail (no auth required)
router.get("/:roomId", (req, res, next) => roomController.getRoomDetail(req, res, next))

// Join room (requires guestId)
router.post("/:roomId/join", guestIdValidator, (req, res, next) => roomController.joinRoom(req, res, next))

// Start room (requires guestId)
router.post("/:roomId/start", guestIdValidator, (req, res, next) => roomController.startRoom(req, res, next))

// End room (no auth required)
router.post("/:roomId/end", (req, res, next) => roomController.endRoom(req, res, next))

// Rate room (requires guestId)
router.post("/:roomId/rating", guestIdValidator, (req, res, next) => roomController.rateRoom(req, res, next))

// Stream room updates (SSE)
router.get("/:roomId/stream", (req, res, next) => streamController.streamRoomUpdates(req, res, next))

export default router
