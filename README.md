# Where-in-the-World
OSU Hackathon Project - This web app contains an interactive map for OSU students to pin their geographic location. As students in an online program, it can often feel like you're alone in this battle. Our hope is that this tool will help students foster connections within their local communities.
<p>Created during the spring 2020 hackathon</p>
<p>By: Alexis Chasney, Kelley Neubauer, Andre Paul, and Jason Rash</p>

## Live Version
https://where-in-the-world-osu.herokuapp.com/

## Setting up the project locally
Requires Node & npm

1.  Clone the repository
2.  Create one Google Cloud Platform API key restricted to Maps Javascript API.
3.  Replace YOUR_KEY with the key created in and replace the bottom script in index.handlebars with
<code> <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&callback=initMap"></script> </code>
4.  Add a new system environment variable to your computer named GOOGLE_MAPS_API_KEY and set it equal to your Geocoding API key
5.  Save the system environment variable
6.  Create a postgres database locally or create a postgres database using heroku.
7.  Get all the postgres credentials and create system environment variables for DB_HOST, DB_USER, DB_NAME, DB_PW, DB_PORT.
7.  Download and install Node.js if you do not have it installed from https://nodejs.org/en/
7.  Open the terminal and navigate to Where-in-the-World folder, then type <code>npm install</code>
9.  <code>npm start</code>
11. Open up localhost:5000 in your browser to run the app.

