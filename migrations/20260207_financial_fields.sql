-- Add financial fields to the 'events' table
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_estimate numeric;
ALTER TABLE events ADD COLUMN IF NOT EXISTS hourly_rate numeric;
ALTER TABLE events ADD COLUMN IF NOT EXISTS callout_fee numeric;
ALTER TABLE events ADD COLUMN IF NOT EXISTS cost_context text[];
