import { LargeNumberLike } from "crypto";
import { DBGameUser, GameInfo, PlayerInfo, User } from "../../../../types/global";
import db from "../connection";
import { ADD_PLAYER, CONDITIONALLY_JOIN_SQL, CREATE_SQL, DEAL_CARDS_SQL, GET_CARD_SQL, GET_GAME_INFO_SQL, GET_PLAYER_HAND_COUNT_SQL, GET_PLAYER_HAND_SQL, GET_PLAYERS_SQL, GET_PLAYERS_WITH_HAND_COUNT_SQL, IS_HOST_SQL, SET_IS_CURRENT_SQL, SETUP_DECK_SQL } from "./sql";

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
};

type GetGameInfoResponse = Pick<GameInfo, 'name' | 'password' | 'min_players' | 'max_players'> & {player_count: number;}

const getInfo = async(gameId: number): Promise<GetGameInfoResponse>=> {
    //const {name, min_players, max_players, password} = await db.one<GameInfo>(GET_GAME_INFO_SQL, [gameId]);
    return await db.one<GetGameInfoResponse>(GET_GAME_INFO_SQL, [gameId]);
};

const dealCards = async(userId: number, gameId: number, cardCount: number, pile: number) =>{
    await db.none(DEAL_CARDS_SQL, {userId, gameId, cardCount, pile})
};

const getPlayers = async(gameId: number): Promise<(User & DBGameUser)[]> => {
    return await db.many(GET_PLAYERS_SQL, gameId);
};

const getPlayersWithHandCount = async(gameId: number): Promise<{ id: string; email: string; gravatar: string; hand_count: number }[]> => {
    return await db.many(GET_PLAYERS_WITH_HAND_COUNT_SQL, gameId);
}

const setCurrentPlayer = async (gameId: number, userId: number) => {
    await db.none(SET_IS_CURRENT_SQL, {gameId, userId, });
};

export const STOCK_PILE = 0;
export const PLAYER_HAND = 1;
export const DISCARD_1 = 2;
export const DISCARD_2 = 3;
export const DISCARD_3 = 4;
export const DISCARD_4 = 5;

export const DRAW_PILE = 0;
export const NORTH_PILE = 1;
export const EAST_PILE = 2;
export const SOUTH_PILE = 3;
export const WEST_PILE = 4;


const start = async (gameId: number) =>{
    //add cards to game
    await db.none(SETUP_DECK_SQL, {gameId });
    //get player count
    const players = await getPlayers(gameId);
    console.log({players});

    //deal cards
    for(let i = 0; i < players.length; i++){
        //console.log("player");
        //deal cards to a USER in a GAME with SOME NUMBER OF CARDS into SOME PILE
        await dealCards(players[i].id, gameId, 0, STOCK_PILE);//may be vestigial, remove later?
        await dealCards(players[i].id, gameId, 5, PLAYER_HAND);
    }
    await dealCards(-1, gameId, 1, PLAYER_HAND);//add card to discard pile

    //set current player
    await setCurrentPlayer(gameId, players[0].id);
};



const  getState = async (gameId: number) => {
    //getInfo(),
    const {name} = await getInfo(gameId);
    console.log({name});
    //getPlayers(),
    const players = (await getPlayers(gameId)).map(({id, email, gravatar, seat, is_current: isCurrent}) => ({
        id, email, gravatar, seat, isCurrent,
    }));
    console.log({players});

    // const result = {
    //     name,
    //     buildPiles: await Promise.all([NORTH_PILE, EAST_PILE, SOUTH_PILE, WEST_PILE].map((pile) =>{
    //         return db.one(GET_CARD_SQL, {gameId, pile, userId: 0, limit: 1});
    //     })),
    //     players: {}
    //     // players: players.reduce((acc, player) => {
    //     //     acc[player.id] = player;
    //     //     return acc;
    //     // }, {} as Record<number, PlayerInfo>),
    // };

    const playerInfo: Record<number, PlayerInfo> = {};
    for(let i = 0; i < players.length; i++){
        const { id } = players[i];
        console.log({id});
        try{
            playerInfo[id] = {
                ...players[id],
                hand: await db.manyOrNone(GET_CARD_SQL, {gameId, userId: id, limit: 52, pile: PLAYER_HAND,}),
                stockPileTop: await db.one(GET_CARD_SQL, {gameId, userId: id, limit: 0, pile: STOCK_PILE,}),//vestigial, remove later
                discardPiles: await Promise.all([DISCARD_1, DISCARD_2, DISCARD_3, DISCARD_4].map(pile => {//vestigial, remove later
                    return db.oneOrNone(GET_CARD_SQL, {gameId, userId: id, limit: 0})//vestigial, remove later
                })),//vestigial, remove later
            };
        }catch(error){
            console.error({error});
        }


        // const hand = await;
        // const stockPileTop
        //result.players[id] = players[i];
    }

    return {
        name,
        buildPiles: await Promise.all([NORTH_PILE, EAST_PILE, SOUTH_PILE, WEST_PILE].map((pile) =>{
            return db.one(GET_CARD_SQL, {gameId, pile, userId: 0, limit: 1});
        })),
        players: playerInfo,
        // players: players.reduce((acc, player) => {
        //     acc[player.id] = player;
        //     return acc;
        // }, {} as Record<number, PlayerInfo>),
    };


    // const result = {
    //     name,
    //     //playerIds: players.map(({id}) => id),
    //     players: players.reduce((acc, player) => {
    //         acc[player.id] = player;

    //         return acc;
    //     }, {} as Record<number, any>
    // ),
    // }
    //Need to get
    //build piles (N,E,S,W) (top card)
    //stock pile top card for each player
    //discard piles for each player
    //hand for each player

    //handPerPlayer(),
    /*
    export const STOCK_PILE = 0;
    export const PLAYER_HAND = 1;
    export const DISCARD_1 = 2;
    export const DISCARD_2 = 3;
    export const DISCARD_3 = 4;
    export const DISCARD_4 = 5;

    export const NORTH_PILE = 1;
    export const EAST_PILE = 2;
    export const SOUTH_PILE = 3;
    export const WEST_PILE = 4;
    */
};

const getUserHand = async (gameId: number, userId: number) => {
    return await db.manyOrNone(GET_PLAYER_HAND_SQL, { gameId, userId, pile: PLAYER_HAND});
};

export default { create, join, getHost, getState, getInfo, start, dealCards, getPlayers, setCurrentPlayer, getUserHand, getPlayersWithHandCount, cardLocations: {
    STOCK_PILE: STOCK_PILE,
    PLAYER_HAND: PLAYER_HAND,
    DISCARD_1: DISCARD_1,
    DISCARD_2: DISCARD_2,
    DISCARD_3: DISCARD_3,
    DISCARD_4: DISCARD_4,
    DRAW_PILE: DRAW_PILE,
    NORTH_PILE: NORTH_PILE,
    EAST_PILE: EAST_PILE,
    SOUTH_PILE: SOUTH_PILE,
    WEST_PILE: WEST_PILE}
};