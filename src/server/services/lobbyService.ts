// src/server/services/lobbyService.ts
import { getLobbies, getLobby, saveLobby, deleteLobby } from '../db/games/lobby';
import crypto from 'crypto';

export interface Lobby {
  id: string;
  name: string;
  host: string;
  players: string[];
  created: number;
  started: boolean;
  chat: any[];
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export function listLobbies(): ServiceResult<Lobby[]> {
  try {
    const lobbies = getLobbies();
    return { success: true, data: lobbies };
  } catch (e) {
    console.error('[lobbyService:listLobbies]', e);
    return { success: false, error: { code: 'LOBBY_LIST_ERROR', message: 'Failed to list lobbies.' } };
  }
}

export function createLobby(user: { id: string; email: string; gravatar?: string } | undefined, name?: string): ServiceResult<Lobby> {
  try {
    if (!user || !user.id) {
      return { success: false, error: { code: 'UNAUTHENTICATED', message: 'User not authenticated.' } };
    }
    const id = crypto.randomUUID();
    const lobby: Lobby = {
      id,
      name: name || `Lobby ${id.slice(0, 4)}`,
      host: user.id,
      players: [user.id],
      created: Date.now(),
      started: false,
      chat: []
    };
    saveLobby(lobby);
    return { success: true, data: lobby };
  } catch (e) {
    console.error('[lobbyService:createLobby]', e);
    return { success: false, error: { code: 'LOBBY_CREATE_ERROR', message: 'Failed to create lobby.' } };
  }
}

export function joinLobby(user: { id: string; email: string; gravatar?: string } | undefined, lobbyId: string): ServiceResult<Lobby> {
  try {
    if (!user || !user.id) {
      return { success: false, error: { code: 'UNAUTHENTICATED', message: 'User not authenticated.' } };
    }
    const lobby = getLobby(lobbyId);
    if (!lobby) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Lobby not found.' } };
    }
    if (!lobby.players.includes(user.id)) {
      lobby.players.push(user.id);
      saveLobby(lobby);
    }
    return { success: true, data: lobby };
  } catch (e) {
    console.error('[lobbyService:joinLobby]', e);
    return { success: false, error: { code: 'LOBBY_JOIN_ERROR', message: 'Failed to join lobby.' } };
  }
}

export function leaveLobby(user: { id: string; email: string; gravatar?: string } | undefined, lobbyId: string): ServiceResult<Lobby> {
  try {
    if (!user || !user.id) {
      return { success: false, error: { code: 'UNAUTHENTICATED', message: 'User not authenticated.' } };
    }
    const lobby = getLobby(lobbyId);
    if (!lobby) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Lobby not found.' } };
    }
    lobby.players = lobby.players.filter((pid: string) => pid !== user.id);
    saveLobby(lobby);
    return { success: true, data: lobby };
  } catch (e) {
    console.error('[lobbyService:leaveLobby]', e);
    return { success: false, error: { code: 'LOBBY_LEAVE_ERROR', message: 'Failed to leave lobby.' } };
  }
}
