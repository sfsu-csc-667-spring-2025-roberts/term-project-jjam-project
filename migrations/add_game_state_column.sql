-- UP: Add a 'state' column to the games table to store the full game state as JSON
ALTER TABLE games ADD COLUMN state jsonb DEFAULT '{}';

-- DOWN: Remove the 'state' column if rolling back
-- (Uncomment if your migration tool supports DOWN migrations)
-- ALTER TABLE games DROP COLUMN state;
