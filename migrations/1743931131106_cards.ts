import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('cards', {
        id: 'id',
        suite: {
            type: "integer",
            notNull: true,
        },
        value: {
            type: "integer",
            notNull: true,
        }
    });

    //standard crazy eights deck has 52 cards:

    const cards = [];
    for (let suite = 0; suite < 4; suite++) {
        for (let value = 0; value < 13; value++) {
            cards.push({ id: suite * 13 + value + 1, suite: suite, value: value });
        }
    }

    // Generate the SQL INSERT statement from the cards array
    const sqlValues = cards.map(card => `(${card.id}, ${card.suite}, ${card.value})`).join(', ');

    pgm.sql(`INSERT INTO cards (id, suite, value) VALUES ${sqlValues};`);

    // const cards = [];
    // for(let i = 1; i <= 12; i++) {
    //     for(let j = 0; j < 12; j++){
    //         cards.push({id: i * 12 + j, value: i });
    //     }
    // }

    // pgm.sql(
    //     'INSERT INTO cards (id, suite, value) VALUES (1, 0, 0), (2, 0, 1), (3, 0, 2), (4, 0, 3), (5, 0, 4), (6, 0, 5), (7, 0, 6), (8, 0, 7), (9, 0, 8), (10, 0, 9), (11, 0, 10), (12, 0, 11), (13, 0, 12),(14, 1, 0), (15, 1, 1), (16, 1, 2), (17, 1, 3), (18, 1, 4), (19, 1, 5), (20, 1, 6), (21, 1, 7), (22, 1, 8), (23, 1, 9), (24, 1, 10), (25, 1, 11), (26, 1, 12), (27, 2, 0), (28, 2, 1), (29, 2, 2), (30, 2, 3), (31, 2, 4), (32, 2, 5), (33, 2, 6), (34, 2, 7), (35, 2, 8), (36, 2, 9), (37, 2, 10), (38, 2, 11), (39, 2, 12),(40, 3, 0), (41, 3, 1), (42, 3, 2), (43, 3, 3), (44, 3, 4), (45, 3, 5), (46, 3, 6), (47, 3, 7), (48, 3, 8), (49, 3, 9), (50, 3, 10), (51, 3, 11), (52, 3, 12);'
    // )


}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("cards");
}
