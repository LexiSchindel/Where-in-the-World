var express = require('express');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// postgres database set up
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

// create table
const query = client.query(
    'CREATE TABLE maps(id SERIAL PRIMARY KEY, lat DOUBLE not null, long DOUBLE not null, city VARCHAR(100), state VARCHAR(50), email VARCHAR(40))');
  query.on('end', () => { client.end(); });


// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });