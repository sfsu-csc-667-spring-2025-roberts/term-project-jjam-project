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

export const GET_GAME_INFO_SQL = `
SELECT name, min_players, max_players, password, (SELECT COUNT(*) FROM game_users WHERE game_id=$1 )::int AS player_count 
FROM games 
WHERE id = $1`;

export const GET_PLAYERS_SQL = `
SELECT users.id, users.email, users.gravatar, game_users.*
FROM users, game_users WHERE users.id=game_users.user_id AND game_users.game_id=$1 ORDER BY seat`;

export const SETUP_DECK_SQL = `INSERT INTO game_cards(game_id, user_id, card_id, card_order, pile)
SELECT $(gameId), 0, id, FLOOR(random() * 10000), 0 FROM cards    
`;

export const DEAL_CARDS_SQL = `
UPDATE game_cards 
SET user_id=$(userId), pile=$(pile) 
WHERE game_id=$(gameId) 
    AND card_id IN (
        SELECT card_id 
        FROM game_cards 
        WHERE user_id=0 
        ORDER BY card_order, card_id 
        LIMIT $(cardCount)
    )
`;

export const SET_IS_CURRENT_SQL = `UPDATE game_users SET is_current=(game_users.user_id=$(userId)) WHERE game_id=$(gameId)`;

export const GET_CARD_SQL = `SELECT cards. * FROM cards, game_cards WHERE user_id=$(userId) AND pile=$(pile) AND game_id=$(gameId) ORDER BY game_cards.card_order ASC LIMIT $(limit)`;
