import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    try {
        pgm.sql(`
            ALTER TABLE game_cards
            ADD COLUMN chosen_suit VARCHAR(1); -- 'S', 'H', 'D', 'C', or NULL
        `);
    } catch (error) {
        console.error("Error adding chosen_suit column:", error);
        throw error; // Re-throw the error to stop the migration
    }
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    try {
        pgm.sql(`
            ALTER TABLE game_cards
            DROP COLUMN chosen_suit;
        `);
    } catch (error) {
        console.error("Error dropping chosen_suit column:", error);
        throw error; // Re-throw the error to stop the migration
    }
}