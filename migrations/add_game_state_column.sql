-- Add a 'state' column to the games table to store the full game state as JSON
ALTER TABLE games ADD COLUMN state jsonb DEFAULT '{}';
