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
SELECT user_id FROM game_users WHERE game_id = $1 ORDER BY seat LIMIT 1
`;

export const GET_GAME_INFO_SQL = `
SELECT name, min_players, max_players, password, (SELECT COUNT(*) FROM game_users WHERE game_id=$1 )::int AS player_count
FROM games
WHERE id = $1`;

export const GET_PLAYERS_SQL = `
SELECT users.id, users.email, users.gravatar, game_users.*
FROM users, game_users WHERE users.id=game_users.user_id AND game_users.game_id=$1 ORDER BY seat`;

export const SETUP_DECK_SQL = `INSERT INTO game_cards(game_id, user_id, card_id, card_order, pile)
SELECT $(gameId), 0, id, FLOOR(random() * 10000), 0 FROM cards
WHERE id <= 52--prevent wild 8 card results from entering deck
`;

export const CONVERT_SPECTATOR_TO_PLAYER = `
UPDATE game_users
SET ingame = TRUE
WHERE game_id = $1;
`;

export const IS_PLAYER = `
SELECT ingame
FROM game_users
WHERE game_id = $1
AND user_id = $2
`;

export const CLEAR_DECK_SQL = `
UPDATE game_cards
DELETE
FROM game_cards
WHERE game_id=$(gameId);
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

export const MOVE_DISCARD_CARD_SQL = `
UPDATE game_cards
SET pile = CASE
    WHEN card_id > 52 THEN 3 --if card is a 8 result, put it in pile 3 instead of 2 for future deletion
        ELSE 2
    END
WHERE game_id = $(gameId)
    AND user_id = -1
    AND pile = 1;
`;

export const DISCARD_CARD_SQL = `
UPDATE game_cards
SET user_id = -1, pile= 1 --top of discard deck
WHERE game_id = $(gameId) --from this specific game
    AND card_id = $(cardId) --take this specific card
`;

export const GET_DISCARDED_CARD_ID_SQL = `
SELECT card_id 
FROM game_cards 
WHERE user_id = -1 
    AND pile = 1 
    AND game_id = $(gameId);
`;


export const GET_PLAYER_HAND_SQL = `
SELECT * FROM game_cards
WHERE game_id=$(gameId)
    AND user_id=$(userId)
    AND pile=1;
`;

export const SET_IS_CURRENT_SQL = `UPDATE game_users SET is_current=(game_users.user_id=$(userId)) WHERE game_id=$(gameId)`;

export const GET_CARD_SQL = `SELECT cards. * FROM cards, game_cards WHERE user_id=$(userId) AND pile=$(pile) AND game_id=$(gameId) ORDER BY game_cards.card_order ASC LIMIT $(limit)`;

export const GET_PLAYER_HAND_COUNT_SQL = `
SELECT COUNT(*) AS hand_count
FROM game_cards
WHERE game_id = $1 AND user_id = $2 AND pile = 1;
`;

export const GET_PLAYERS_WITH_HAND_COUNT_SQL = `
SELECT
    u.id,
    u.email,
    u.gravatar,
    (SELECT COUNT(*) FROM game_cards gc WHERE gc.game_id = gu.game_id AND gc.user_id = gu.user_id AND gc.pile = 1) AS hand_count
FROM users u
JOIN game_users gu ON u.id = gu.user_id
WHERE gu.game_id = $1
ORDER BY gu.seat;
`;

export const GET_IS_CURRENT = `
SELECT user_id 
FROM game_users
WHERE game_id=$(gameId)
AND is_current=true;
`;

export const IS_DECK_EMPTY_SQL = `
SELECT
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM game_cards
            WHERE user_id = 0
            AND game_id=$(gameId)
        )
        THEN 'false'
        ELSE 'true' --return true if the deck is empty
    END AS contains_card_with_userid_0;
`;

export const SHUFFLE_DISCARD_SQL = `
DELETE FROM game_cards
WHERE game_id = $(gameId)
    AND user_id = -1
    AND pile = 3;

-- Then, if no card with pile = 3 was found and deleted, shuffle the discard pile
INSERT INTO game_cards (user_id, pile, card_order, game_id, card_id)
SELECT 0, 0, FLOOR(random() * 10000), $(gameId), card_id
FROM game_cards
WHERE game_id = $(gameId)
    AND user_id = -1
    AND pile = 2;

DELETE FROM game_cards
WHERE game_id = $(gameId)
    AND user_id = -1
    AND pile = 2;
`;

export const HIGHEST_SEAT_SQL = `
    SELECT MAX(seat) AS highest_seat
    FROM game_users
    WHERE game_id = $(gameId)
    AND ingame = true
`;

export const LOWEST_SEAT_SQL = `
    SELECT MIN(seat) AS lowest_seat
    FROM game_users
    WHERE game_id = $(gameId)
    AND ingame = true
`;

export const CONVERT_ID_TO_SEAT = `
SELECT seat AS curr_seat
FROM game_users
WHERE
    game_id = $(gameId)
    AND user_id = $(userId)
`;

export const FLIP_IS_CURRENT = `
UPDATE game_users
SET
    is_current = CASE
        WHEN is_current = TRUE THEN FALSE
        ELSE TRUE
    END
WHERE
    game_id = $(gameId)
    AND seat = $(seat)
`;

export const GET_PLAYER_NAME_SQL = ` 
SELECT email AS player
FROM users
WHERE
    id = $(id)
`;

export const RESET_DECK = `
DELETE from game_cards
WHERE game_id = $(gameId)
`;


export const CLEAR_TURNS = `
UPDATE game_users
SET is_current = false
WHERE game_id = $(gameId)
`;

export const WILD_EIGHT_CARD_RESULT = `
INSERT INTO game_cards (game_id, user_id, card_id, card_order, pile)
VALUES ($(gameId), -1, $(eightValue), 0, 0);--pile left as 1 as we don't need it to be 3 until after it is discarded
`;

export const DELETE_GAME_SQL = `
DELETE from games
WHERE id = $(gameId)
`;

export const DOES_GAME_EXIST_SQL = `
SELECT id
FROM games
WHERE id = $1;
`;

export const DISCARD_PLAYER_HAND_SQL = `--if a player leaves a game, send their cards into the discard pile
UPDATE game_cards
SET user_id = -1, pile= 2 --send to discard deck all cards
WHERE game_id = $(gameId) --from this specific game
    AND user_id = $(userId) --from this specific player
`;

export const LEAVE_GAME_SQL = `--only run AFTER clearing their hand
DELETE 
FROM game_users
WHERE game_id = $(gameId)
AND user_id = $(userId)
`;

export const DOES_SEAT_EXIST_SQL = `
SELECT seat
FROM game_users
WHERE game_id = $1
AND seat = $2
`;

export const GET_GAME_PLAYER_COUNT = `
SELECT COUNT(*) AS number_of_players
FROM game_users
WHERE game_id = $1;
`;

export const GET_NEXT_SEAT = `
SELECT MIN(seat) AS next_seat
FROM game_users
WHERE game_id = $1
AND seat > $2
AND ingame = true --prevent players who join midgame from being able to play
`;