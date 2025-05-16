import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        INSERT INTO cards (id, suite, value) VALUES
        (53, 0, 8),
        (54, 1, 8),
        (55, 2, 8),
        (56, 3, 8);
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        DELETE FROM cards WHERE id IN (53, 54, 55, 56);
    `);
}