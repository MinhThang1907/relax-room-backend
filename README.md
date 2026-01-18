# Relax Room Backend API

Backend API độc lập cho web app Relax Room. Xây dựng bằng Node.js, Express, TypeScript và Supabase.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime (SSE Bridge)
- **Validation**: Zod
- **Code Quality**: ESLint + Prettier

## Quick Start

### 1. Cài đặt Dependencies

```bash
cd backend
npm install
# hoặc
pnpm install
```

### 2. Cấu hình Environment Variables

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Điền các giá trị thực:

```env
PORT=4000
SUPABASE_URL=https://your_actual_project_id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
SUPABASE_ANON_KEY=your_actual_anon_key
STORAGE_BUCKET=moods-audio
FRONTEND_ORIGIN=http://localhost:3000
```

**Cách lấy Supabase credentials:**

1. Vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **Settings** → **API**
4. Copy `URL` → `SUPABASE_URL`
5. Copy `anon public key` → `SUPABASE_ANON_KEY`
6. Scroll down → **service_role key** → Copy → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Tạo Database Schema

Vào [Supabase SQL Editor](https://app.supabase.com) của project:

1. Click **SQL Editor** ở sidebar trái
2. Click **+ New Query**
3. Copy toàn bộ nội dung từ `db/schema.sql`
4. Paste vào editor
5. Click **Run** (hoặc Ctrl+Enter)
6. Repeat với `db/seed.sql`

**Hoặc dùng Supabase CLI** (nếu cài):

```bash
supabase db push --db-url "postgresql://user:password@host:5432/postgres"
```

### 4. Tạo Storage Bucket

Vào [Supabase Dashboard](https://app.supabase.com):

1. Vào **Storage** ở sidebar
2. Click **+ New Bucket**
3. Điền tên: `moods-audio`
4. Uncheck "Private bucket" (để public)
5. Click **Create bucket**

### 5. Upload Audio Files (Optional)

Để test SSE, bạn có thể upload file audio:

1. Vào Storage bucket `moods-audio`
2. Upload file `.mp3`
3. Đặt tên file trùng với giá trị trong `audio_path` của seed (ví dụ: `rain_night.mp3`)

API sẽ tự động generate public URL từ filename.

### 6. Chạy Backend

```bash
npm run dev
```

Backend sẽ chạy ở `http://localhost:4000`

```
✓ Server running at http://localhost:4000
✓ CORS enabled for: http://localhost:3000
```

## API Endpoints

### Health Check

```
GET /api/health
```

Response:
```json
{
  "ok": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Moods

```
GET /api/moods
```

Response:
```json
{
  "ok": true,
  "data": [
    {
      "id": "uuid",
      "name": "Mưa đêm",
      "description": "Âm thanh mưa rơi...",
      "tags": ["rain", "night", "chill"],
      "audioUrl": "https://... .mp3"
    }
  ]
}
```

```
GET /api/moods/:id
```

### Rooms

**Create Room** (requires header `x-guest-id`)

```
POST /api/rooms
Content-Type: application/json
x-guest-id: user-123

{
  "moodId": "uuid",
  "durationMinutes": 5
}
```

Response:
```json
{
  "ok": true,
  "data": {
    "roomId": "uuid"
  }
}
```

**Get Room Detail**

```
GET /api/rooms/:roomId
```

**Join Room** (requires header `x-guest-id`)

```
POST /api/rooms/:roomId/join
x-guest-id: user-123
```

**Start Room** (requires header `x-guest-id`, must be host)

```
POST /api/rooms/:roomId/start
x-guest-id: user-123
```

**End Room**

```
POST /api/rooms/:roomId/end
```

**Rate Room** (requires header `x-guest-id`)

```
POST /api/rooms/:roomId/rating
Content-Type: application/json
x-guest-id: user-123

{
  "rating": "BETTER"
}
```

### Stream Room Updates (SSE)

```
GET /api/rooms/:roomId/stream

Headers:
  Accept: text/event-stream
  Cache-Control: no-cache
```

Client nhận các events:

- `connected` - khi connection thiết lập
- `room_updated` - khi room data thay đổi (status, started_at, ends_at)
- `participants_updated` - khi có người join/leave
- `ping` - keep-alive signal mỗi 25s

Ví dụ JavaScript:

```javascript
const eventSource = new EventSource('http://localhost:4000/api/rooms/room-uuid/stream');

eventSource.addEventListener('room_updated', (event) => {
  const roomData = JSON.parse(event.data);
  console.log('Room updated:', roomData);
});

eventSource.addEventListener('participants_updated', (event) => {
  const participantData = JSON.parse(event.data);
  console.log('Participant updated:', participantData);
});

eventSource.onerror = (error) => {
  console.error('SSE error:', error);
  eventSource.close();
};
```

## Response Format (Chuẩn hoá)

**Success:**

```json
{
  "ok": true,
  "data": { ... }
}
```

**Error:**

```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Thông báo lỗi tiếng Việt"
  }
}
```

## Error Codes

| Code | HTTP Status | Meaning |
|------|---|---|
| `MISSING_GUEST_ID` | 400 | Header `x-guest-id` bị thiếu |
| `VALIDATION_ERROR` | 400 | Dữ liệu request không hợp lệ |
| `MOOD_NOT_FOUND` | 404 | Không tìm thấy mood |
| `ROOM_NOT_FOUND` | 404 | Không tìm thấy phòng |
| `NOT_HOST` | 403 | User không phải chủ phòng |
| `ROOM_ENDED` | 400 | Phòng đã kết thúc |
| `INVALID_STATE` | 400 | Trạng thái phòng không hợp lệ |
| `INTERNAL_SERVER_ERROR` | 500 | Lỗi server |

## Project Structure

```
src/
├── server.ts              # Express app bootstrap
├── routes/                # API route definitions
│   ├── health.ts
│   ├── moods.ts
│   └── rooms.ts
├── controllers/           # Request handlers (thin layer)
│   ├── moodController.ts
│   ├── roomController.ts
│   └── streamController.ts
├── services/              # Business logic
│   ├── moodService.ts
│   ├── roomService.ts
│   └── ratingService.ts
├── repositories/          # Database CRUD
│   ├── moodRepository.ts
│   ├── roomRepository.ts
│   ├── roomParticipantRepository.ts
│   ├── roomRatingRepository.ts
│   └── storageRepository.ts
├── domain/                # Types & validation
│   ├── types.ts
│   └── schemas.ts
├── lib/                   # External service clients
│   ├── supabaseClient.ts
│   └── storageBucket.ts
├── middleware/            # Express middleware
│   ├── cors.ts
│   ├── errorHandler.ts
│   ├── requestLogger.ts
│   └── guestIdValidator.ts
└── utils/                 # Utilities
    ├── response.ts
    └── timeHelpers.ts

db/
├── schema.sql             # Database schema
└── seed.sql               # Initial data
```

## Code Quality

### Lint Code

```bash
npm run lint
npm run lint:fix
```

### Format Code

```bash
npm run format
npm run format:check
```

## Authentication & Security (MVP vs Future)

### Current (MVP - guestId based)

- Frontend gửi header `x-guest-id` với mỗi request
- Đơn giản, không cần backend auth infrastructure
- **Cảnh báo:** Không an toàn cho production

### Future (Real Authentication)

1. **Supabase Auth**
   - Thay thế guestId bằng JWT từ `supabase.auth.signUp()`
   - Middleware verify JWT
   - Row Level Security (RLS) trên database

2. **Implementation**
   ```typescript
   // middleware/authValidator.ts
   const token = req.headers.authorization?.split('Bearer ')[1];
   const { data } = await supabaseAdmin.auth.getUser(token);
   req.user = data.user;
   ```

3. **Enable RLS** trên Supabase:
   ```sql
   ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "users can manage own rooms"
     ON rooms FOR ALL
     USING (auth.uid()::text = host_user_id);
   ```

## Realtime SSE vs WebSocket

Backend hiện dùng **SSE (Server-Sent Events)** vì:
- Đơn giản, không cần socket.io
- Hỗ trợ Supabase Realtime native
- Chi phí thấp hơn WebSocket
- One-way stream (server → client)

Nếu cần two-way realtime (client → server), upgrade sang WebSocket.

## Troubleshooting

### "Missing SUPABASE_URL"

- Kiểm tra `.env` file có tồn tại không
- Kiểm tra các env variables đúng format

### "CORS error"

- Kiểm tra `FRONTEND_ORIGIN` trong `.env` trùng với URL frontend
- Nếu frontend ở `http://localhost:3000`, env phải là `FRONTEND_ORIGIN=http://localhost:3000`

### "Room not found"

- Kiểm tra `roomId` format là UUID hợp lệ
- Kiểm tra database seed đã chạy (ít nhất moods table có data)

### SSE Connection không connect

- Kiểm tra room tồn tại (`GET /api/rooms/:roomId`)
- Kiểm tra CORS headers: `Access-Control-Allow-Origin`
- Browser DevTools → Network → Event Stream để debug

## Production Deployment

### Vercel/Railway

```bash
npm run build
npm start
```

**Env variables cần setup:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `STORAGE_BUCKET`
- `FRONTEND_ORIGIN`
- `PORT` (auto-set by platform, optional)

### Database Backups

Supabase tự động backup hàng ngày. Vào **Settings** → **Backups** để restore.

## License

MIT
