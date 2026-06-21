-- Add event information acknowledgment field to student_progress table
ALTER TABLE student_progress ADD COLUMN event_info_acknowledged boolean DEFAULT false;