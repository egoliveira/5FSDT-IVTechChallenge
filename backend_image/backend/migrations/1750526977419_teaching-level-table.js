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
    pgm.createTable('teaching_level', {
        id: 'id',
        name: {
            type: 'varchar(255)',
            notNull: true,
            unique: true,
        },
        order: {
            type: 'int',
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
    });

    pgm.createTrigger(
        'teaching_level',
        'tg_update_teaching_level_updated_at',
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
    pgm.dropTrigger('teaching_level', 'tg_update_teaching_level_updated_at');

    pgm.dropTable('teaching_level');
};

module.exports = {shorthands, up, down};