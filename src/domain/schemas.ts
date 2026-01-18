import { z } from "zod"

// Mood schemas
export const MoodSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  audio_path: z.string(),
  tags: z.array(z.string()),
  is_active: z.boolean(),
  created_at: z.string(),
})

export const MoodResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  audioUrl: z.string(),
})

// Room schemas
export const RoomSchema = z.object({
  id: z.string().uuid(),
  mood_id: z.string().uuid(),
  duration_minutes: z.number().int().positive(),
  status: z.enum(["LOBBY", "RUNNING", "ENDED"]),
  host_user_id: z.string(),
  created_at: z.string(),
  started_at: z.string().nullable(),
  ends_at: z.string().nullable(),
})

// Room Participant schemas
export const RoomParticipantSchema = z.object({
  room_id: z.string().uuid(),
  user_id: z.string(),
  joined_at: z.string(),
  left_at: z.string().nullable(),
})

export const ParticipantResponseSchema = z.object({
  userId: z.string(),
  joinedAt: z.string(),
})

// Room Rating schemas
export const RoomRatingSchema = z.object({
  id: z.string().uuid(),
  room_id: z.string().uuid(),
  user_id: z.string(),
  rating: z.enum(["BETTER", "SAME", "WORSE"]),
  created_at: z.string(),
})

// Request schemas
export const CreateRoomRequestSchema = z.object({
  moodId: z.string().uuid("ID mood không hợp lệ"),
  durationMinutes: z
    .number()
    .int()
    .refine((val) => [5, 10, 25].includes(val), {
      message: "Thời gian phòng phải là 5, 10 hoặc 25 phút",
    }),
})

export const JoinRoomRequestSchema = z.object({
  userId: z.string().min(1, "User ID không được để trống"),
})

export const RatingRequestSchema = z.object({
  rating: z.enum(["BETTER", "SAME", "WORSE"], {
    errorMap: () => ({ message: "Rating phải là BETTER, SAME hoặc WORSE" }),
  }),
})

// Room Detail Response schema
export const RoomDetailResponseSchema = z.object({
  room: z.object({
    id: z.string().uuid(),
    moodId: z.string().uuid(),
    durationMinutes: z.number().int(),
    status: z.enum(["LOBBY", "RUNNING", "ENDED"]),
    hostUserId: z.string(),
    createdAt: z.string(),
    startedAt: z.string().nullable(),
    endsAt: z.string().nullable(),
  }),
  mood: MoodResponseSchema,
  participants: z.array(ParticipantResponseSchema),
})
