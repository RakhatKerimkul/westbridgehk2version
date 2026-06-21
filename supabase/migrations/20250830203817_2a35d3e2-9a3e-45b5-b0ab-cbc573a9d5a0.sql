-- Add new roles to the app_role enum
DO $$
BEGIN
  -- Add 'parent' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'app_role' AND e.enumlabel = 'parent'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'parent';
  END IF;

  -- Add 'student' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'app_role' AND e.enumlabel = 'student'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'student';
  END IF;
END $$;