import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("users", {
        gravatar: {
            type: "VARCHAR(255)",
            default: null,
        },
    });

    //pgm.sql("UPDATE users SET gravatar = sha256(email)");
    // 2. Update the user with id 0
    pgm.sql(`
        UPDATE users
        SET gravatar = ''
        WHERE id = 0;
    `);

    // 3. Add the NOT NULL constraint *after* the update.
    pgm.alterColumn('users', 'gravatar', {
        notNull: true,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumns("users", ["gravatar"]);
}

