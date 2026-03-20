CREATE TABLE IF NOT EXISTS `registrations` (
  `id`         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `full_name`  TEXT NOT NULL,
  `email`      TEXT NOT NULL,
  `phone`      TEXT,
  `region`     TEXT,
  `farm_size`  TEXT,
  `crops`      TEXT,
  `message`    TEXT,
  `locale`     TEXT DEFAULT 'en',
  `created_at` TEXT DEFAULT (CURRENT_TIMESTAMP)
);
