-- CHALLENGE 2: Fix foreign key relationships between communications and users tables
-- This file contains the SQL to fix the relationships

-- First, let's ensure we have the proper tables with the correct structure
-- (These should already exist, but we're being explicit)

-- Add foreign key constraints for sender_id
ALTER TABLE communications 
ADD CONSTRAINT fk_communications_sender 
FOREIGN KEY (sender_id) REFERENCES users(id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Add foreign key constraints for recipient_id  
ALTER TABLE communications 
ADD CONSTRAINT fk_communications_recipient 
FOREIGN KEY (recipient_id) REFERENCES users(id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_communications_sender_id ON communications(sender_id);
CREATE INDEX IF NOT EXISTS idx_communications_recipient_id ON communications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_communications_created_at ON communications(created_at);

-- Add a composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_communications_sender_created ON communications(sender_id, created_at);
CREATE INDEX IF NOT EXISTS idx_communications_recipient_created ON communications(recipient_id, created_at);
