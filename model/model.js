const mysql = require('mysql');
const dbConfig = require('../config/database.json');
const connection = mysql.createConnection(dbConfig);
connection.connect(err => {
    if (err) throw err;
    console.log('Mysql connect success!');
});

function model(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

module.exports = model;