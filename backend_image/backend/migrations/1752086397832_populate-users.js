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
    // Password is admin@123
    let sql = "INSERT INTO \"user\" (username, name, email, password, active) VALUES ('admin', 'Schola Blog Administrator', 'admin@schola.blog', '$2b$10$dkzY4/VivJGiT1egI77KAOlxNT5TB7Q7UWbrEbYldroBG/6J3na8C', true)";

    pgm.sql(sql);

    sql = "INSERT INTO user_roles (user_id, admin, teacher, student) VALUES ((SELECT id FROM \"user\" WHERE username='admin'), true, true, false)";

    pgm.sql(sql);

    // Password is teacher@123
    sql = "INSERT INTO \"user\" (username, name, email, password, active) VALUES ('teacher', 'Schola Blog Teacher', 'teacher@schola.blog', '$2b$10$WEMwNAaUXTuUPERouNgXdu/dmHBzy/gHOpDlIubBJICjpA0pD5bHa', true)";

    pgm.sql(sql);

    sql = "INSERT INTO user_roles (user_id, admin, teacher, student) VALUES ((SELECT id FROM \"user\" WHERE username='teacher'), true, true, false)";

    pgm.sql(sql);

    // Password is student@123
    sql = "INSERT INTO \"user\" (username, name, email, password, active) VALUES ('student', 'Schola Blog Student', 'student@schola.blog', '$2b$10$RHAAKLKkSK/nJJE6vX2P0ewCF3WS7HCoAs9dGKuurgmbytXIB46JC', true)";

    pgm.sql(sql);

    sql = "INSERT INTO user_roles (user_id, admin, teacher, student) VALUES ((SELECT id FROM \"user\" WHERE username='student'), false, false, true)";

    pgm.sql(sql);

    sql = "INSERT INTO student (user_id) VALUES ((SELECT id FROM \"user\" WHERE username='student'))";

    pgm.sql(sql);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.sql("DELETE FROM student WHERE user_id = (SELECT id FROM \"user\" WHERE \"user\".username='student')");

    pgm.sql("DELETE FROM user_roles WHERE user_id = (SELECT id FROM \"user\" WHERE \"user\".username='student')");

    pgm.sql("DELETE FROM \"user\" WHERE username = 'student'");

    pgm.sql("DELETE FROM user_roles WHERE user_id = (SELECT id FROM \"user\" WHERE \"user\".username='teacher')");

    pgm.sql("DELETE FROM \"user\" WHERE username = 'teacher'");

    pgm.sql("DELETE FROM user_roles WHERE user_id = (SELECT id FROM \"user\" WHERE \"user\".username='admin')");

    pgm.sql("DELETE FROM \"user\" WHERE username = 'admin'");
};

module.exports = {shorthands, up, down};