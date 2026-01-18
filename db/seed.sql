-- Insert seed moods (Gen Z style Vietnamese names)
INSERT INTO moods (name, description, audio_path, tags, is_active) VALUES
(
  'Mưa đêm',
  'Âm thanh mưa rơi trong đêm yên tĩnh, tạo cảm giác thả lỏng hoàn toàn',
  'rain_night.mp3',
  ARRAY['rain', 'night', 'chill', 'relax'],
  TRUE
),
(
  'Quán cà phê',
  'Tiếng nước chảy, tách chén, nói chuyện nhỏ nhẹ - vibe cozy quán cafe',
  'coffee_shop.mp3',
  ARRAY['cafe', 'ambient', 'social', 'work'],
  TRUE
),
(
  'Sóng biển',
  'Tiếng sóng vỗ nhẹ trên bãi cát trắng, thả hồn ra đại dương',
  'ocean_waves.mp3',
  ARRAY['beach', 'ocean', 'water', 'relax'],
  TRUE
),
(
  'Rừng đêm',
  'Tiếng côn trùng, gió thổi qua lá cây, bước chân trên lá rơi',
  'forest_night.mp3',
  ARRAY['forest', 'nature', 'dark', 'deep'],
  TRUE
),
(
  'Tàu đêm',
  'Tiếng tàu chạy trên đường ray, rung lắc nhẹ nhàng - perfect cho giấc ngủ',
  'train_night.mp3',
  ARRAY['train', 'transport', 'sleep', 'rhythmic'],
  TRUE
),
(
  'Phòng trọ mùa thi',
  'Tiếng đèn neon, máy tính chạy, bàn phím gõ - vibe ôn tập cấp tốc',
  'study_room.mp3',
  ARRAY['study', 'work', 'focus', 'late-night'],
  TRUE
),
(
  'Quạt máy',
  'Tiếng quạt chạy đều đều - monotone để tập trung và giảm stress',
  'fan_sound.mp3',
  ARRAY['fan', 'white-noise', 'focus', 'sleep'],
  TRUE
),
(
  'Lửa lò sưởi',
  'Tiếng lửa cháy, gỗ nổ nhẹ - ấm áp mà không nóng nực',
  'fireplace.mp3',
  ARRAY['fire', 'warm', 'cozy', 'ambient'],
  TRUE
),
(
  'White noise',
  'Âm thanh trắng tinh khiết - giảm tất cả tiếng ồn khác để ngủ sâu',
  'white_noise.mp3',
  ARRAY['noise', 'sleep', 'focus', 'scientific'],
  TRUE
),
(
  'Brown noise',
  'Âm thanh nâu sâu - bass thấp, giống tiếng gió mạnh qua rừng',
  'brown_noise.mp3',
  ARRAY['noise', 'sleep', 'deep', 'bass'],
  TRUE
);
