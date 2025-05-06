import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('users', {
        id: 'id',
        email: {
            type: "varchar(100)",
            notNull: true,
            unique: true,
        },
        password: {
            type: "varchar(100)",
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('now()'),
        },
        
    });
    //  Insert the "deck" user with id 0.  Important:  Explicitly set the ID.
    pgm.sql(`
        INSERT INTO users (id, email, password, created_at, updated_at)
        VALUES (0, 'deck_user@example.com', 'deck_password', now(), now());
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("users");
}
