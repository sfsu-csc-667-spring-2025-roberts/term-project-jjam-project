import connection from "./connection";

export const CONDITIONALLY_JOIN_SQL = `
INSERT INTO game_players (game_id, user_id)
SELECT $(gameId), $(userId) 
WHERE NOT EXISTS (
  SELECT 'value-doesnt-matter' 
  FROM game_players 
  WHERE game_id=$(gameId) AND user_id=$(userId)
)
AND (
  SELECT COUNT(*) FROM games WHERE id=$(gameId) AND password=$(password)
) = 1
AND (
  (
    SELECT COUNT(*) FROM game_players WHERE game_id=$(gameId)
  ) < (
    SELECT max_players FROM games WHERE id=$(gameId)
  )
)
RETURNING (
  SELECT COUNT(*) FROM game_players WHERE game_id=$(gameId)
)
`;

export async function conditionallyJoinGame({ gameId, userId, password }: { gameId: number, userId: number, password: string }) {
  try {
    const result = await connection.oneOrNone(CONDITIONALLY_JOIN_SQL, { gameId, userId, password });
    if (!result) {
      return { success: false, reason: "Join conditions not met" };
    }
    return { success: true, playerCount: Object.values(result)[0] };
  } catch (error) {
    return { success: false, error };
  }
}
