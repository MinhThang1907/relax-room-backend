import { Router, type Request, type Response } from "express"

const router = Router()

router.get("/", (req: Request, res: Response) => {
  res.json({
    ok: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
    },
  })
})

export default router
