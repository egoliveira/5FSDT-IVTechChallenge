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
    pgm.createTable('teaching_grade', {
        id: 'id',
        teaching_level_id: {
            type: 'integer',
            notNull: true,
            references: 'teaching_level'
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
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

    pgm.createIndex('teaching_grade',
        ['teaching_level_id', 'name'],
        {
            unique: true,
        }
    );

    pgm.createTrigger(
        'teaching_grade',
        'tg_update_teaching_grade_updated_at',
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
    pgm.dropTrigger('teaching_grade', 'tg_update_teaching_grade_updated_at');

    pgm.dropTable('teaching_grade');
};

module.exports = {shorthands, up, down};