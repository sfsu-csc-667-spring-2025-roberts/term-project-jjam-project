import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    // Insert a new user with id -1
    pgm.sql(`
        INSERT INTO users (id, email, password, created_at, updated_at, gravatar)
        VALUES (-1, 'discard_pile@example.com', 'discard_password', now(), now(), '');
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    // Optionally, you can add a down migration to remove the user
    pgm.sql(`
        DELETE FROM users WHERE id = -1;
    `);
}