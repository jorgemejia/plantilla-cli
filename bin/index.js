#!/usr/bin/env node
const chalk = require("chalk");
const boxen = require("boxen");
const yargs = require("yargs");
const dotenv = require( "dotenv" );
const { exec } = require("child_process");


// read in settings
dotenv.config();

// const greeting = chalk.white.bold("Hello!");

// const boxenOptions = {
//     padding: 1,
//     margin: 1,
//     borderStyle: "round",
//     borderColor: "green",
//     backgroundColor: "#555555"
// };
// const msgBox = boxen( greeting, boxenOptions );

// console.log(msgBox);

const options = yargs
    .usage("Usage: -n <name>")
    // .option("n", { alias: "name", describe: "Your name", type: "string" })
    .option("table", { alias: "table name", describe: "Name of the table", type: "string", demandOption: true })
    .argv;

// const greeting = `Hello, ${options.name}!`;


const createModelCommand = `sequelize-auto-models -h ${process.env.DB_HOST} -d ${process.env.DB_NAME} -u ${process.env.DB_USER} -x ${process.env.DB_PASS} -p ${process.env.DB_PORT}  -e ${process.env.DB_DIALECT}  -o ${process.env.PATH_TO_MODELS} -t ${options.table}`

console.log(createModelCommand);

exec(createModelCommand, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

// console.log(greeting);
