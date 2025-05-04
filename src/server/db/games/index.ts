import db from "../connection";
import { ADD_PLAYER, CONDITIONALLY_JOIN_SQL, CREATE_SQL, IS_HOST_SQL } from "./sql";

// const CREATE_SQL = `INSERT INTO games (name, min_players, max_players, password) VALUES ($1, $2, $3, $4) RETURNING id`;
// const ADD_PLAYER = `INSERT INTO game_users (game_id, user_id) VALUES ($1, $2)`;

const create = async (name: string, minPlayers: string, maxPlayers: string, password: string, userId: number) => {
    const { id: gameId } = await db.one<{id: number}>(CREATE_SQL, [name, minPlayers, maxPlayers, password,]);

    await db.none(ADD_PLAYER, [gameId, userId]);

    return gameId;
}

const join = async (userId: number, gameId: number, password: string = "") =>{
    const { playerCount } = await db.one(CONDITIONALLY_JOIN_SQL, {gameId, userId, password});
    return playerCount;
}

const getHost = async (gameId: number) => {
    const { user_id } = await db.one<{user_id: number}>(IS_HOST_SQL, [gameId]);

    return user_id;
}

export default { create, join, getHost }