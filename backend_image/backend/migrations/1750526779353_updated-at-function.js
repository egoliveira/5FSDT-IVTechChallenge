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
    pgm.createFunction(
        'fn_update_updated_at',
        [],
        {
            replace: true,
            returns: 'trigger',
            language: 'plpgsql'
        },
        'BEGIN ' +
        'NEW.updated_at = CURRENT_TIMESTAMP;' +
        'RETURN NEW;' +
        'END;'
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropFunction('fn_update_updated_at');
};

module.exports = { shorthands, up, down };