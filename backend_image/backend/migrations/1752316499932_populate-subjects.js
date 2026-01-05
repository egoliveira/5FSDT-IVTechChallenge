const subjects = [
    'Português',
    'Matemática',
    'Ciências',
    'Geografia',
    'História',
    'Arte',
    'Educação Física',
    'Inglês',
    'Filosofia',
    'Biologia',
    'Física',
    'Química',
    'Espanhol'
];

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
    subjects.forEach(subject => {
        pgm.sql(`INSERT INTO subject (name)
                 VALUES ('${subject}')`);
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    subjects.forEach(subject => {
        pgm.sql(`DELETE
                 FROM subject
                 WHERE name = '${subject}'`);
    });
};

module.exports = {shorthands, up, down};
