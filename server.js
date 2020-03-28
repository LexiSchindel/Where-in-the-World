var express = require('express');
const Client = require("@googlemaps/google-maps-services-js").Client;
var app = express();
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//static files
app.use(express.static('client'));

//handlbars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//database connection (local)
const { Pool } = require('pg');

//localhost connection for testing
// const pool = new Pool({
//   host: 'localhost',
//   database: 'map',
//   password: 'flyhomes',
//   port: 5432,
// });

// heroku database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
  ssl: true,
});

app.listen(port, () => console.log(`Listening on port ${port}`));

//index
app.get("/", function(req, res){
  let context = {};
  let result = [];
  pool.query("SELECT * FROM maps", (err, rows) => 
    {
      if(err){
          console.log(err);
          return;
      }
      
      result = rows.rows;
      // console.log("rows: ", result);

      context.results = JSON.stringify(result);
      console.log("context: ", context);
      res.render("index", context);
    });
});

//other index render
app.get ("/index", function(req, res){
  let context = {};
  let result = [];
  pool.query("SELECT * FROM maps", (err, rows) => 
    {
      if(err){
          console.log(err);
          return;
      }
      
      result = rows.rows;
      // console.log("rows: ", result);

      context.results = JSON.stringify(result);
      console.log("context: ", context);
      res.render("index", context);
    });
});

//about
app.get ("/about", function(req, res){
  res.render("about");
});

//stats
app.get ("/stats", function(req, res){
  res.render("stats");
});

app.post ("/", async (request, response) => {
  const email = request.body.email;
  const address = request.body.address;
  console.log(address);
  var latitude;
  var longitude;
  var city;
  var state;
  var country;

  var context = {}; //for returning to post request

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
      console.log("r.data ", r.data);
      latitude = r.data.results[0].geometry.location.lat;
      longitude = r.data.results[0].geometry.location.lng;
      // loop through address_components to look for data of a specific type
      for (let i = 0; i < r.data.results[0].address_components.length; i++) {
        if (r.data.results[0].address_components[i].types[0] == "locality") {
          city = r.data.results[0].address_components[i].long_name;
        }
        else if (r.data.results[0].address_components[i].types[0] == "administrative_area_level_1") {
          state = r.data.results[0].address_components[i].long_name;
        }
        else if (r.data.results[0].address_components[i].types[0] == "country") {
          country = r.data.results[0].address_components[i].long_name;
        }
      }

      console.log("latitude ", latitude, "longitude ", longitude);
      console.log("city ", city, "state ", state, "country ", country);

      var results = [];

      results.push({"latitude": latitude,
        "longitude": longitude,
        "city": city,
        "state": state,
        "country": country});

      var context = {}; //for returning to post request

      context.results = insertDB(latitude, longitude, city, state, email, callback);

    })
    .catch(e => {
      console.log("e ", e);
    });

})



function insertDB(latitude, longitude, city, state, email, callback){
  pool.query("INSERT INTO maps(latitude, longitude, city, state, email) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
    [latitude, longitude, city, state, email], function(err, result){
    if(err){
        console.log(err);
        return;
    }
    else{
      console.log("insert db");

      function callback() { 
        
        let allDB = getAllDB();

        return allDB; 
      };

      return callback();
    }
  });
}

function getAllDB(callback){
  let result;

  pool.query("SELECT * FROM maps", (err, rows) => {
    if(err){
        console.log(err);
        return;
    }

    function callback() { 
        
      result = rows.rows;

      return JSON.stringify(result);
    };

    return callback();
  });
}