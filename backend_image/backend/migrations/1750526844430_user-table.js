/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
    pgm.createTable(
        'user',
        {
            id: 'id',
            username: {
                type: 'varchar(100)',
                notNull: true,
                unique: true,
            },
            name: {
                type: 'varchar(255)',
                notNull: true,
            },
            email: {
                type: 'varchar(255)',
                notNull: true,
            },
            password: {
                type: 'varchar(255)',
                notNull: true,
            },
            active: {
                type: 'boolean',
                default: true,
                notNull: true,
            },
            created_at: {
                type: 'timestamp',
                notNull: true,
                default: pgm.func('NOW()'),
            },
            updated_at: {
                type: 'timestamp',
                notNull: true,
                default: pgm.func('NOW()'),
            }
        }
    );

    pgm.createTrigger(
        'user',
        'tg_update_user_updated_at',
        {
            when: 'BEFORE',
            level: 'ROW',
            operation: 'UPDATE',
            function: 'fn_update_updated_at'
        }
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropTrigger('user', 'tg_update_user_updated_at');

    pgm.dropTable('user');
};

module.exports = {shorthands, up, down};