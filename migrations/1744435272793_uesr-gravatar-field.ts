import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("users", {
        gravatar: {
            type: "VARCHAR(255)",
            notNull: true,
            default: null,
        },
    });

    //pgm.sql("UPDATE users SET gravatar = sha256(email)");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumns("users", ["gravatar"]);
}

