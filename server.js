const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const app = express();


const port = process.env.PORT || '1245';

 
// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

// Set Cors Header
app.use((req, res, next) => { 
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();  
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set our api routes
app.use('/api', require('./server/controller/routes.controller.js'));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'build')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build','index.html'));
});

// start app
app.listen(port);

// User message
console.log('Application is open on port ' + port);