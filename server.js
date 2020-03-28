var express = require('express');
const Client = require("@googlemaps/google-maps-services-js").Client;
var app = express();
const PORT = process.env.PORT || 5000;
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

app.post ("/", async (request, response) => {
  const email = request.body.email;
  const address = request.body.address;

client
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