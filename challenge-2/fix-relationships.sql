-- CHALLENGE 2: Fix foreign key relationships between communications and users tables
-- This file should contain your SQL to fix the relationships

-- TODO: Add foreign key constraints here
-- You need to:
-- 1. Add foreign key constraint for sender_id -> users.id
-- 2. Add foreign key constraint for recipient_id -> users.id
-- 3. Add indexes for performance
-- 4. Handle any existing data issues

-- Example structure (you need to complete this):
/*
-- Add foreign key constraints
ALTER TABLE communications 
ADD CONSTRAINT fk_communications_sender 
FOREIGN KEY (sender_id) REFERENCES users(id);

ALTER TABLE communications 
ADD CONSTRAINT fk_communications_recipient 
FOREIGN KEY (recipient_id) REFERENCES users(id);

-- Add indexes for performance
CREATE INDEX idx_communications_sender_id ON communications(sender_id);
CREATE INDEX idx_communications_recipient_id ON communications(recipient_id);
*/


-- Create table communications
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    sender_id UUID,
    recipient_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alter foreign coloums
ALTER TABLE communications
  ADD CONSTRAINT fk_sender
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_recipient
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE SET NULL;


-- Create indexes
CREATE INDEX idx_communications_sender_id ON communications(sender_id);
CREATE INDEX idx_communications_recipient_id ON communications(recipient_id);
CREATE INDEX idx_communications_created_at ON communications(created_at);