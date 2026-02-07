-- Add reference number and friendly ID columns
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS ref_number text,
ADD COLUMN IF NOT EXISTS friendly_id text UNIQUE;

-- Create sequence for the numeric part of the ID
-- We start at 1. The ID format is [AA-ZZ][00001-99999]
-- Logic: 
-- Seq 1 -> AA00001
-- Seq 99999 -> AA99999
-- Seq 100000 -> AB00000 (Wait, user usually wants 1-indexed, so AB00001?)
-- Let's stick to simple mod logic.
-- Group (Prefix) = (seq - 1) / 99999
-- Number = ((seq - 1) % 99999) + 1

CREATE SEQUENCE IF NOT EXISTS event_id_seq START 1;

-- Function to generate the friendly ID
CREATE OR REPLACE FUNCTION generate_friendly_id() 
RETURNS TRIGGER AS $$
DECLARE
    v_seq bigint;
    v_group bigint;
    v_num bigint;
    v_char1 char;
    v_char2 char;
    v_prefix text;
BEGIN
    -- Only generate if not provided
    IF NEW.friendly_id IS NULL THEN
        -- Get next sequence value
        v_seq := nextval('event_id_seq');
        
        -- Calculate group (AA, AB, etc.) and number
        -- Each group has 99,999 items (00001 to 99999)
        v_group := (v_seq - 1) / 99999;
        v_num := ((v_seq - 1) % 99999) + 1;
        
        -- Generate prefix characters
        -- ASCII 'A' is 65
        -- v_group 0 -> AA (0, 0)
        -- v_group 1 -> AB (0, 1)
        -- v_group 26 -> BA (1, 0)
        
        v_char1 := chr(65 + (v_group / 26)::int);
        v_char2 := chr(65 + (v_group % 26)::int);
        v_prefix := v_char1 || v_char2;
        
        -- Format ID
        NEW.friendly_id := v_prefix || lpad(v_num::text, 5, '0');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_friendly_id ON events;
CREATE TRIGGER set_friendly_id
    BEFORE INSERT ON events
    FOR EACH ROW
    EXECUTE FUNCTION generate_friendly_id();

-- Backfill existing events (optional, but good for consistency)
-- DO $$
-- DECLARE
--   r RECORD;
-- BEGIN
--   FOR r IN SELECT id FROM events WHERE friendly_id IS NULL ORDER BY created_at ASC
--   LOOP
--     UPDATE events SET friendly_id = 'HIST-' || substring(id::text, 1, 8) WHERE id = r.id; 
--   END LOOP;
-- END $$;
