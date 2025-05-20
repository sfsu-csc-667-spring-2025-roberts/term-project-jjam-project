import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    try {
        pgm.addColumns('game_users', {
            ingame: {
                type: 'boolean',
                notNull: true,
                default: false, //Set a default value
            },
        });
    } catch (error) {
        console.error("Error adding ingame column:", error);
        throw error; // Re-throw the error to stop the migration
    }
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    try {
        pgm.dropColumn('game_users', 'ingame');
    } catch (error) {
        console.error("Error dropping ingame column:", error);
        throw error; // Re-throw the error to stop the migration
    }
}