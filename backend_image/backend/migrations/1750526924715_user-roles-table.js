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
    pgm.createTable('user_roles', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            unique: true,
            references: 'user',
        },
        admin: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        teacher: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        student: {
            type: 'boolean',
            notNull: true,
            default: false,
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
    });

    pgm.createTrigger(
        'user_roles',
        'tg_update_user_roles_updated_at',
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
    pgm.dropTrigger('user_roles', 'tg_update_user_roles_updated_at');

    pgm.dropTable('user_roles');
};

module.exports = {shorthands, up, down};