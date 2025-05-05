import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("game_cards", {
        game_id: {
            type: "integer",
            notNull: true,
            references: "games",
            onDelete: "CASCADE",
        },
        user_id: {
            type:"integer",
            notNull: true,
            references:"users",
            onDelete: "CASCADE",
        },
        card_id: {
            type: "integer",
            notNull: true,
            references: "cards",
            onDelete: "CASCADE",
        },
        card_order: {
            type: "integer",
            notNull: true,
        },
        pile:{
            type: "integer",
            notNull: true,
        },
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("game_cards");
}
