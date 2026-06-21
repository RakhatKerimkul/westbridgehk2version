-- Add CFO questions columns to student_progress table
ALTER TABLE student_progress ADD COLUMN cfo_future_answer text;
ALTER TABLE student_progress ADD COLUMN cfo_motivation_answer text;