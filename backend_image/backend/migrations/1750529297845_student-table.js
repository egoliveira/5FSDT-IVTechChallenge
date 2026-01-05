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
    pgm.createTable('student', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'user',
            unique: true
        },
        teaching_grade_id: {
            type: 'integer',
            notNull: false,
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
    });

    pgm.createTrigger(
        'student',
        'tg_update_student_updated_at',
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
    pgm.dropTrigger('student', 'tg_update_student_updated_at');

    pgm.dropTable('student');
};

module.exports = {shorthands, up, down};