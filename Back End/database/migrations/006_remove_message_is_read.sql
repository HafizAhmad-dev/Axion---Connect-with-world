-- Remove the old global read-state field.
-- Read/unread state is now stored per participant
-- in conversation_participants.

ALTER TABLE messages
DROP COLUMN is_read;