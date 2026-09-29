ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS client_message_id UUID;

CREATE UNIQUE INDEX IF NOT EXISTS messages_sender_client_message_unique 
ON messages (sender_id, client_message_id) 
WHERE client_message_id IS NOT NULL;
