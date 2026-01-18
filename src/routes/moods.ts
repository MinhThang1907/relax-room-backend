import { Router } from "express"
import { moodController } from "../controllers/moodController"

const router = Router()

router.get("/", (req, res, next) => moodController.getActiveMoods(req, res, next))
router.get("/:id", (req, res, next) => moodController.getMoodById(req, res, next))

export default router
