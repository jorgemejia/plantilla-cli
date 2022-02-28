#!/usr/bin/env node

var sequelizeAuto = require('../');
var path = require('path');
var Sequelize = require('sequelize');
var _ = Sequelize.Utils._;

var argv = require('yargs')
    .usage('Usage: sequelize-auto-models -h <host> -d <database> -u <user> -x [password] -p [port]  --dialect [dialect] -c [/path/to/config] -o [/path/to/models] -t [tableName] -o [/path/to/interfaces]')
    .demand(['h', 'd'])
    .alias('h', 'host')
    .alias('d', 'database')
    .alias('u', 'user')
    .alias('x', 'pass')
    .alias('p', 'port')
    .alias('c', 'config')
    .alias('o', 'output')
    .alias('i', 'output-interfaces')
    .alias('e', 'dialect')
    .alias('a', 'additional')
    .alias('t', 'tables')
    .alias('T', 'skip-tables')
    .alias('C', 'camel')
    .alias('n', 'no-write')
    .alias('s', 'schema')
    .alias('z', 'typescript')
    .alias('f', 'camel-file-name')
    .describe('h', 'IP/Hostname for the database.')
    .describe('d', 'Database name.')
    .describe('u', 'Username for database.')
    .describe('x', 'Password for database.')
    .describe('p', 'Port number for database.')
    .describe('c', 'JSON file for Sequelize\'s constructor "options" flag object as defined here: https://sequelize.readthedocs.org/en/latest/api/sequelize/')
    .describe('o', 'What directory to place the models.')
    .describe('i', 'What directory to place the interfaces.')
    .describe('e', 'The dialect/engine that you\'re using: postgres, mysql, sqlite, mssql')
    .describe('a', 'Path to a json file containing model definitions (for all tables) which are to be defined within a model\'s configuration parameter. For more info: https://sequelize.readthedocs.org/en/latest/docs/models-definition/#configuration')
    .describe('t', 'Comma-separated names of tables to import')
    .describe('T', 'Comma-separated names of tables to skip')
    .describe('C', 'Use camel case to name models and fields')
    .describe('n', 'Prevent writing the models to disk.')
    .describe('s', 'Database schema from which to retrieve tables')
    .describe('z', 'Output models as typescript with a definitions file')
    .describe('f', 'Use camel case for file name')
    .argv;

var dir = !argv.n && (argv.o || path.resolve(process.cwd() + '/models'));
var intDir = !argv.n && (argv.i || path.resolve(process.cwd() + '/interfaces'));

var configFile = {
    spaces: true,
    indentation: 2
}

if (argv.c) {
    configFile = require(path.resolve(argv.c));
}

configFile.directory = configFile.directory || dir;
configFile.interfaceDir = configFile.interfaceDir || intDir;

var additional = {};
if (argv.a) {
    additional = require(path.resolve(argv.a));
}

if (configFile.additional) {
    additional = configFile.additional;
}

configFile.additional = additional;
configFile.dialect = argv.e || configFile.dialect || 'mysql';
configFile.port = argv.p || configFile.port || getDefaultPort(configFile.dialect);
configFile.host = argv.h || configFile.host || 'localhost';
configFile.storage = argv.d;
configFile.tables = configFile.tables || (argv.t && argv.t.split(',')) || null;
configFile.skipTables = configFile.skipTables || (argv.T && argv.T.split(',')) || null;
configFile.camelCase = !!argv.C;
configFile.schema = argv.s || configFile.schema;
configFile.typescript = argv.z || configFile.typescript || false;
configFile.camelCaseForFileName = argv.f || configFile.camelCaseForFileName || false;

function getDefaultPort(dialect) {
    switch (dialect.toLowerCase()) {
        case 'mssql':
            return 1433;
        case 'postgres':
            return 5432;
        default:
            return 3306;
    }
}

var auto = new sequelizeAuto(argv.d, argv.u, (!! argv.x ? ('' + argv.x) : null), configFile);

auto.run(function (err) {
    if (err) throw err;
    console.log('Done!');
});
