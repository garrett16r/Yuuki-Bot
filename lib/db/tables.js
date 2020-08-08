const fs = require('fs');
const csv = require('csv-parser');
const db = require('./db.js');

// Iterates through the pokemon-list.csv file to load NatDex numbers, names, and odds into the pokemon table in the DB
let loadPokemonData = () => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, con) => {
            if (err) reject(err);
            fs.createReadStream('./res/pokemon-list.csv')
                .pipe(csv())
                .on('data', (row) => {
    
                    var id;
    
                    // Format id to match the 000 format in the DB
                    if (row.id < 100) {
                        if (row.id < 10) {
                            id = `00${row.id}`; // Single digit numbers are 00x
                        } else {
                            id = `0${row.id}` // Double digits are 0xx
                        }
                    } else {
                        id = row.id; // Triple digits are xxx
                    }
    
                    let sql = 'INSERT INTO pokemon (id, name, odds) VALUES (?, ?, ?)';
                    let values = [id, row.name, row.odds];
    
                    con.query(sql, values);
                })
                .on('end', () => {
                    console.log("Imported Pokemon data!");
                    con.release();
                    resolve();
                });
        });
    });
}

//Updates the pokemon table's records to include a path to each pokemon's sprite file.
let setSpritePaths = () => {
    return new Promise((resolve, reject) => {
        db.getConnection(async (err, con) => {

            const spritePath = './res/sprites/';
            let sql = 'UPDATE pokemon SET sprite = IF(sprite IS NOT NULL, sprite, ?) WHERE id = ?';
            let values;
            let files = fs.readdirSync(spritePath);
            let sub = 0; // How many spaces back to go due to alolan and galarian form sprite files
    
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                var id;
    
                // Format id to match the 000 format in the DB
                if (i < 115) {
                    if (i < 9) {
                        id = `00${i + 1}`; // Single digit numbers are 00x
                    } else {
                        id = `0${(i - sub) + 1}` // Double digits are 0xx
                    }
                } else {
                    id = `${(i - sub) + 1}`; // Triple digits are xxx
                }

                // Use id to locate sprite image up to #807 (Zeraora)
                if (file.includes(`_${id}_`) && id < 808) {
                    values = [file, id];
                    con.query(sql, values);
                
                // Making Alolan forms work based on the id in the filename takes a total of 10 lines of code that take way too long to figure out
                } else if (file.includes(`${id}-alola`) && id < 106) { // Alolan forms will never be above an id of 105
                    let newid = `${file.split('_')[2].split('-')[0]}a`; // Obtains id from file name, e.g. '019a' for Alolan Rattata
    
                    values = [file, newid];
                    
                    con.query(sql, values);
                    sub++; // Account for extra file for alolan form sprite
    
                } else if (id >= 808) { // Use name to locate sprite image up to #893 (Zarude) plus Galarian forms

                    name = file.split("(")[0];
                    sql = 'UPDATE pokemon SET sprite = IF(sprite IS NOT NULL, sprite, ?) WHERE name = ?'

                    // Galarian forms based on just filename take 6 lines of code that take 5 minutes to figure out. Cool.
                    if (name.includes('-galar')) {
                        let galarName = `galarian ${name.split('-')[0]}`;
                        values = [file, galarName];
                    } else {
                        values = [file, name];
                    }
    
                    con.query(sql, values);
                }

                if (err) {
                    reject(err);
                } else {
                    //con.release();
                    resolve();
                }
            }
        });
    })
}

// Creates the 'users' and 'channels' tables if they don't already exist
let createTables = async () => {
    return new Promise((resolve, reject) => {
        db.getConnection( async (err, con) => {
            // Create users table
            con.query(
                `CREATE TABLE IF NOT EXISTS users (
                    id VARCHAR(30) NOT NULL,
                    experience INT NOT NULL DEFAULT 0,
                    level INT NOT NULL DEFAULT 0,
                    target VARCHAR(30),
                    shinies_found INT NOT NULL DEFAULT 0)`
            );
    
            // Create channels table
            con.query(
                `CREATE TABLE IF NOT EXISTS channels (
                    id VARCHAR(30) PRIMARY KEY,
                    type VARCHAR(10) UNIQUE NOT NULL)`
            );

            // Create shinies table
            con.query(
                `CREATE TABLE IF NOT EXISTS shinies (
                    name VARCHAR(20) NOT NULL,
                    owner_id VARCHAR(30) NOT NULL,
                    odds VARCHAR(15) NOT NULL,
                    date_found DATETIME NOT NULL
                )`
            );
            
            // Create pokemon table
            con.query(
                `CREATE TABLE IF NOT EXISTS pokemon (
                    id VARCHAR(10) PRIMARY KEY,
                    name VARCHAR(20) NOT NULL,
                    sprite VARCHAR(30) UNIQUE,
                    odds INT NOT NULL
                )`
            );
            
            // Import pokemon data from .csv file, then set sprites
            await loadPokemonData();
            await setSpritePaths();

            if (err) {
                reject(err);
            } else {
                con.release();
                resolve();
            }
        });
    })
}

module.exports = { createTables }