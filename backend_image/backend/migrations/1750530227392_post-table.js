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
        'post',
        {
            id: 'id',
            title: {
                type: 'varchar(512)',
                notNull: true
            },
            content: {
                type: 'text',
                notNull: true,
            },
            user_id: {
                type: 'integer',
                notNull: true,
                references: 'user',
            },
            subject_id: {
                type: 'integer',
                notNull: true,
                references: 'subject',
            },
            teaching_grade_id: {
                type: 'integer',
                notNull: true,
                references: 'teaching_grade',
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
        'post',
        'tg_update_post_updated_at',
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
    pgm.dropTrigger('post', 'tg_update_post_updated_at');

    pgm.dropTable('post');
};

module.exports = {shorthands, up, down};