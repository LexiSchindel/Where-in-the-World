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

/*******************************************
 * handle: for homepage load
 * 
 * parameters: none
 * 
 * returns: all current data in database and 
 * renders homepage
 ********************************************/

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

      context.results = JSON.stringify(result);
      console.log("context: ", context);
      res.render("index", context);
    });
});

/*******************************************
 * handle: for stats page
 * 
 * parameter: receives query parameter from client
 * 
 * returns: returns grouped data by city/state or
 * by state depending on query parameter
 ********************************************/

app.get("/dataTable", function(req, res){
  let context = {};
  let result = [];

  console.log('req', req.query);
  if(req.query.type === 'city'){
    pool.query("SELECT (city || ', ' || state) as city, count(id) as total FROM maps GROUP BY 1 ORDER BY 2 DESC, 1", (err, rows) => 
    {
      if(err){
          console.log(err);
          return;
      }
      else{
        result = rows.rows;
        console.log("getdata ", result);

        context.results = JSON.stringify(result);
        res.send(context);
      }
    });
  }
  else if(req.query.type === 'state'){
    pool.query("SELECT state, count(id) as total FROM maps GROUP BY state ORDER BY total DESC, 1", (err, rows) => 
      {
        if(err){
            console.log(err);
            return;
        }
        else{
          result = rows.rows;
          console.log("getdata ", result);

          context.results = JSON.stringify(result);
          res.send(context);
        }
      });
  }
});

/*******************************************
 * handle: for index page
 * 
 * parameter: none
 * 
 * returns: returns all data in database
 ********************************************/

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

      context.results = JSON.stringify(result);
      console.log("context: ", context);
      res.render("index", context);
    });
});

//get data middle route
app.get ("/getdata", function(req, res){
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
    // res.render("index", context);
    res.send(context);
  });
});

/*******************************************
 * handle: for about page
 * 
 * parameter: none
 * 
 * returns: renders about page
 ********************************************/
app.get ("/about", function(req, res){
  res.render("about");
});

/*******************************************
 * handle: for stats page
 * 
 * parameter: none
 * 
 * returns: renders stats page
 ********************************************/
app.get ("/stats", function(req, res){
  res.render("stats");
});

/*******************************************
 * handle: for post requests; takes data 
 * from post and inserts into database
 * 
 * parameter: latitude, longitude, city, state,
 * country, email
 * 
 * returns: all data currently in database,
 * including recently input data
 ********************************************/

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

      //inserts all data from post into database
      pool.query("INSERT INTO maps(latitude, longitude, city, state, email) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
        [latitude, longitude, city, state, email], function(err, result){
          if(err){
              console.log(err);
              return;
          }
          else{
            console.log("insert db");
            
            //get updated data
            pool.query("SELECT * FROM maps", (err, rows) => {
              if(err){
                  console.log(err);
                  return;
              }
              
              result = rows.rows;
              // console.log("rows: ", result);

              context.results = JSON.stringify(result);

              response.send(context);
              
            });
          }
        });
    })
    .catch(e => {
      console.log("e ", e);
    });
})