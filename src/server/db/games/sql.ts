export const CREATE_SQL = `INSERT INTO games (name, min_players, max_players, password) VALUES ($1, $2, $3, $4) RETURNING id`;
export const ADD_PLAYER = `INSERT INTO game_users (game_id, user_id) VALUES ($1, $2)`;
export const REMOVE_PLAYER = `DELETE FROM game_users WHERE game_id = $1 AND user_id = $2 RETURNING *;`;

export const CONDITIONALLY_JOIN_SQL = `
INSERT INTO game_users (game_id, user_id)
SELECT $(gameId), $(userId) 
WHERE NOT EXISTS (
    SELECT 'value-doesnt-matter' 
    FROM game_users 
    WHERE game_id=$(gameId) AND user_id=$(userId)
)
AND (
    SELECT COUNT(*) FROM games WHERE id=$(gameId) AND password=$(password)
) = 1
AND (
    (
    SELECT COUNT(*) FROM game_users WHERE game_id=$(gameId)
    ) < (
    SELECT max_players FROM games WHERE id=$(gameId)
    )
)
RETURNING (
    SELECT COUNT(*) AS playerCount FROM game_users WHERE game_id=$(gameId)
)
`;

export const IS_HOST_SQL = `
SELECT user_id FROM game_users ORDER BY seat LIMIT 1`;