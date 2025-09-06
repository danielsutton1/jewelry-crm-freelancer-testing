ALTER TABLE communications 
ADD CONSTRAINT fk_communications_sender 
FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE communications 
ADD CONSTRAINT fk_communications_recipient 
FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_communications_sender_id ON communications(sender_id);
CREATE INDEX idx_communications_recipient_id ON communications(recipient_id);
CREATE INDEX idx_communications_created_at ON communications(created_at);
