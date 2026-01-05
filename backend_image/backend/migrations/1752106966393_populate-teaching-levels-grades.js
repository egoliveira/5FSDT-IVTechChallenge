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
    pgm.sql("INSERT INTO teaching_level (name, \"order\") VALUES ('Ensino Fundamental', 1)");
    pgm.sql("INSERT INTO teaching_level (name, \"order\") VALUES ('Ensino Médio', 2)");

    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Primeiro Ano', 1, (SELECT id FROM teaching_level WHERE name='Ensino Fundamental'))");
    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Segundo Ano', 2, (SELECT id FROM teaching_level WHERE name='Ensino Fundamental'))");
    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Terceiro Ano', 3, (SELECT id FROM teaching_level WHERE name='Ensino Fundamental'))");
    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Quarto Ano', 4, (SELECT id FROM teaching_level WHERE name='Ensino Fundamental'))");
    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Quinto Ano', 5, (SELECT id FROM teaching_level WHERE name='Ensino Fundamental'))");
    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Sexto Ano', 6, (SELECT id FROM teaching_level WHERE name='Ensino Fundamental'))");
    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Sétimo Ano', 7, (SELECT id FROM teaching_level WHERE name='Ensino Fundamental'))");
    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Oitavo Ano', 8, (SELECT id FROM teaching_level WHERE name='Ensino Fundamental'))");
    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Nono Ano', 9, (SELECT id FROM teaching_level WHERE name='Ensino Fundamental'))");

    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Primeiro Ano', 10, (SELECT id FROM teaching_level WHERE name='Ensino Médio'))");
    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Segundo Ano', 11, (SELECT id FROM teaching_level WHERE name='Ensino Médio'))");
    pgm.sql("INSERT INTO teaching_grade (name, \"order\", teaching_level_id) VALUES ('Terceiro Ano', 12, (SELECT id FROM teaching_level WHERE name='Ensino Médio'))");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.sql("DELETE FROM teaching_grade WHERE name='Primeiro Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Fundamental')");
    pgm.sql("DELETE FROM teaching_grade WHERE name='Segundo Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Fundamental')");
    pgm.sql("DELETE FROM teaching_grade WHERE name='Terceiro Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Fundamental')");
    pgm.sql("DELETE FROM teaching_grade WHERE name='Quarto Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Fundamental')");
    pgm.sql("DELETE FROM teaching_grade WHERE name='Quinto Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Fundamental')");
    pgm.sql("DELETE FROM teaching_grade WHERE name='Sexto Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Fundamental')");
    pgm.sql("DELETE FROM teaching_grade WHERE name='Sétimo Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Fundamental')");
    pgm.sql("DELETE FROM teaching_grade WHERE name='Oitavo Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Fundamental')");
    pgm.sql("DELETE FROM teaching_grade WHERE name='Nono Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Fundamental')");

    pgm.sql("DELETE FROM teaching_grade WHERE name='Primeiro Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Médio')");
    pgm.sql("DELETE FROM teaching_grade WHERE name='Segundo Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Médio')");
    pgm.sql("DELETE FROM teaching_grade WHERE name='Terceiro Ano' AND teaching_level_id=(SELECT id FROM teaching_level WHERE name='Ensino Médio')");

    pgm.sql("DELETE FROM teaching_level WHERE name='Ensino Fundamental'");
    pgm.sql("DELETE FROM teaching_level WHERE name='Ensino Médio'");
};

module.exports = {shorthands, up, down};