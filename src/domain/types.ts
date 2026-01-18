// Mood types
export interface Mood {
  id: string
  name: string
  description: string
  audio_path: string
  tags: string[]
  is_active: boolean
  created_at: string
}

export interface MoodResponse {
  id: string
  name: string
  description: string
  tags: string[]
  audioUrl: string
}

// Room types
export type RoomStatus = "LOBBY" | "RUNNING" | "ENDED"

export interface Room {
  id: string
  mood_id: string
  duration_minutes: number
  status: RoomStatus
  host_user_id: string
  created_at: string
  started_at: string | null
  ends_at: string | null
}

// Room Participant types
export interface RoomParticipant {
  room_id: string
  user_id: string
  joined_at: string
  left_at: string | null
}

export interface ParticipantResponse {
  userId: string
  joinedAt: string
}

// Room Rating types
export type RatingType = "BETTER" | "SAME" | "WORSE"

export interface RoomRating {
  id: string
  room_id: string
  user_id: string
  rating: RatingType
  created_at: string
}

// Room detail response
export interface RoomDetailResponse {
  room: {
    id: string
    moodId: string
    durationMinutes: number
    status: RoomStatus
    hostUserId: string
    createdAt: string
    startedAt: string | null
    endsAt: string | null
  }
  mood: MoodResponse
  participants: ParticipantResponse[]
}

// API Response types
export interface ApiResponse<T> {
  ok: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}
