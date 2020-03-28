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

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.listen(port, () => console.log(`Listening on port ${port}`));

console.log("running");

//index
app.get ("/", function(req, res){
  res.render("index");
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