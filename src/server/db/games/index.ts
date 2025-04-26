import db from "../connection";

const CREATE_SQL = `INSERT INTO games (name, min_players, max_players, password) VALUES ($1, $2, $3, $4) RETURNING id`;
const ADD_PLAYER = `INSERT INTO game_users (game_id, user_id) VALUES ($1, $2)`;

const create = async (name: string, minPlayers: string, maxPlayers: string, password: string, userId: number) => {
    const { id: gameId } = await db.one(CREATE_SQL, [name, minPlayers, maxPlayers, password,]);

    await db.none(ADD_PLAYER, [gameId, userId]);

    return gameId;
}

export default { create }