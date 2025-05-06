import 'express-session';

export type User = {
    id: number;
    email: string;
    gravatar: string;
}

export type DBGameUser = {
    game_id: number;
    user_id: number;
    seat: number;
    is_current: boolean;
}

export type ChatMessage = {
    message: string,
    sender: User,
    timestamp: Date;
};

export type GameInfo = {
    id: number;
    name: string;
    min_players: number;
    max_players: number;
    password: string;
    created_at: Date;
}

export type Card = {
    id: number;
    value: number;
}

export type Player = {
    id: number;
    email: string;
    gravatar: string;
    seat: number;
    isCurrent: boolean;
}

export type PlayerInfo = Player &{
    hand: Card[];
    stockPileTop: Card;//vestigial, remove later
    discardPiles: Card[][];//vestigial, remove later
}

declare module 'express-session' {
    interface SessionData {
        user: User;

    }
}

