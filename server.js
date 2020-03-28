var express = require('express');
const Client = require("@googlemaps/google-maps-services-js").Client;
var app = express();
var bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Listening on port ${port}`));
// postgres database set up
const  { Client }  = require('pg');

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

pgClient.connect();

console.log("running");

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
  console.log(address);
  const client = await new Client({address});

client
  .geocode({
    params: {
      address: `${address}`,
      key: process.env.GOOGLE_MAPS_API_KEY
    },
    timeout: 1000 // milliseconds
  })
  .then(r => {
    console.log(r.data.results.geometry.location.lat);
  })
  .catch(e => {
    console.log(e);
  });

})