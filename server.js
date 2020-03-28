var express = require('express');
const mapClient = require("@googlemaps/google-maps-services-js").Client;
var app = express();
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// postgres database set up
const  { Client }  = require('pg');

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

pgClient.connect();

// create table
/* const query = pgClient.query(
    'CREATE TABLE maps(id SERIAL PRIMARY KEY, address VARCHAR(100) not null, email VARCHAR(40))');
   query.on('end', () => { pgClient.end(); }); */


// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

app.post ("/", async (request, response) => {
  const email = request.body.email;
  const address = request.body.address;

mapClient
  .geocode({
    params: {
      address: address,
      key: process.env.GOOGLE_MAPS_API_KEY
    },
    timeout: 1000 // milliseconds
  })
  .then(r => {
    console.log(r.data.results[0].geocode);
  })
  .catch(e => {
    console.log(e);
  });

})