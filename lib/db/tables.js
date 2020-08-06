const fs = require('fs');
const csv = require('csv-parser');
const db = require('./db.js');

// Iterates through the pokemon-list.csv file to load NatDex numbers and names into the pokemon table in the DB
let loadPokemonData = () => {
    return new Promise((resolve, reject) => {
        db.getConnection((err, con) => {
            if (err) reject(err);
            fs.createReadStream('./res/pokemon-list.csv')
                .pipe(csv())
                .on('data', (row) => {
                    //console.log(row);
    
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
    
                    let sql = 'INSERT INTO pokemon (id, name) VALUES (?, ?)';
                    let values = [id, row.name];
    
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

// Updates the pokemon table's records to include a path to each pokemon's sprite file
let setSpritePaths = () => {
    db.getConnection((err, con) => {

        const spritePath = './res/sprites/';
        let sql = 'UPDATE pokemon SET sprite = IF(sprite IS NOT NULL, sprite, ?) WHERE id = ?';
        let values;
        let files = fs.readdirSync(spritePath);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            var id;

            // Format id to match the 000 format in the DB
            if (i < 99) {
                if (i < 9) {
                    id = `00${i + 1}`; // Single digit numbers are 00x
                } else {
                    id = `0${i + 1}` // Double digits are 0xx
                }
            } else {
                id = i + 1; // Triple digits are xxx
            }

            // Use id to locate sprite image up to #807 (Meltan)
            if (file.includes(`_${id}`) && id < 808) {
                values = [file, id];
                con.query(sql, values);

            // Use name to locate sprite image up to #893 (Zarude)
            } else if (id >= 808) {
                name = file.split("(")[0];

                sql = 'UPDATE pokemon SET sprite = IF(sprite IS NOT NULL, sprite, ?) WHERE name = ?'
                values = [file, name];

                con.query(sql, values);
            }
        }

        con.release();
    });
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
                    sprite VARCHAR(30) UNIQUE
                )`
            );
            
            // Import pokemon data from .csv file, then set sprites
            await loadPokemonData();
            setSpritePaths();

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