import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabaseClient';
import { roomParticipantRepository } from '../repositories/roomParticipantRepository';
import { roomRepository } from '../repositories/roomRepository';
import { RoomSchema } from '../domain/schemas';
import type { Room } from '../domain/types';
import { AppError } from '../middleware/errorHandler';

export class StreamController {
  async streamRoomUpdates(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;

      // Verify room exists
      const room = await supabaseAdmin.from('rooms').select('id').eq('id', roomId).single();

      if (room.error) {
        throw new AppError(404, 'ROOM_NOT_FOUND', 'Không tìm thấy phòng');
      }

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || '*');

      // Send initial connection message
      res.write('event: connected\n');
      res.write(`data: ${JSON.stringify({ roomId, connected: true })}\n\n`);

      const initialRoom = await roomRepository.getRoomById(roomId);
      if (initialRoom) {
        const normalizedRoom = {
          id: initialRoom.id,
          moodId: initialRoom.mood_id,
          durationMinutes: initialRoom.duration_minutes,
          status: initialRoom.status,
          hostUserId: initialRoom.host_user_id,
          createdAt: initialRoom.created_at,
          startedAt: initialRoom.started_at,
          endsAt: initialRoom.ends_at,
        };
        res.write('event: room_updated\n');
        res.write(`data: ${JSON.stringify(normalizedRoom)}\n\n`);
      }

      const initialParticipants = await roomParticipantRepository.getRoomParticipants(roomId);
      const normalizedParticipants = initialParticipants.map((participant) => ({
        userId: participant.user_id,
        joinedAt: participant.joined_at,
      }));
      res.write('event: participants_updated\n');
      res.write(`data: ${JSON.stringify(normalizedParticipants)}\n\n`);

      // Subscribe to rooms changes
      const roomsChannel = supabaseAdmin
        .channel(`room:${roomId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rooms',
            filter: `id=eq.${roomId}`,
          },
          (payload: any) => {
            try {
              const roomRecord = payload.new ?? payload.old;
              if (!roomRecord) return;
              const room = RoomSchema.parse(roomRecord) as Room;
              const normalizedRoom = {
                id: room.id,
                moodId: room.mood_id,
                durationMinutes: room.duration_minutes,
                status: room.status,
                hostUserId: room.host_user_id,
                createdAt: room.created_at,
                startedAt: room.started_at,
                endsAt: room.ends_at,
              };
              res.write('event: room_updated\n');
              res.write(`data: ${JSON.stringify(normalizedRoom)}\n\n`);
            } catch (err) {
              console.error('[StreamController] Failed to serialize room update:', err);
            }
          }
        )
        .subscribe((status) => {
          console.log(`[StreamController] room channel status: ${status}`);
        });

      // Subscribe to participants changes
      const participantsChannel = supabaseAdmin
        .channel(`participants:${roomId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'room_participants',
            filter: `room_id=eq.${roomId}`,
          },
          async () => {
            try {
              const participants = await roomParticipantRepository.getRoomParticipants(roomId);
              const normalizedParticipants = participants.map((participant) => ({
                userId: participant.user_id,
                joinedAt: participant.joined_at,
              }));
              res.write('event: participants_updated\n');
              res.write(`data: ${JSON.stringify(normalizedParticipants)}\n\n`);
            } catch (err) {
              console.error('[StreamController] Failed to serialize participants update:', err);
            }
          }
        )
        .subscribe((status) => {
          console.log(`[StreamController] participants channel status: ${status}`);
        });

      // Ping every 25 seconds to keep connection alive
      const pingInterval = setInterval(() => {
        res.write('event: ping\n');
        res.write(`data: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
      }, 25000);

      // Cleanup on disconnect
      req.on('close', () => {
        clearInterval(pingInterval);
        roomsChannel.unsubscribe();
        participantsChannel.unsubscribe();
        res.end();
      });
    } catch (error) {
      next(error);
    }
  }
}

export const streamController = new StreamController();
