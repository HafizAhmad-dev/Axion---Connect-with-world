ALTER TABLE conversation_participants
ADD COLUMN unread_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE conversation_participants
ADD COLUMN last_read_at TIMESTAMP NULL;