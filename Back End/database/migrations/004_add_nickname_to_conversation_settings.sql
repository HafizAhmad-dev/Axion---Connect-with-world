-- Add nickname column to conversation_settings
ALTER TABLE conversation_settings ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_conversation_settings_nickname ON conversation_settings(nickname);