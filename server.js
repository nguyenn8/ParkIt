var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();

var titleArray = [];

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: [
    path.join(__dirname, 'views/partials'),
  ]
}));

app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.status(200).render('login');
});

app.get('/report_bug', function (req, res) {
  res.status(200).render('bugReport');
});

app.get('/search', function (req, res) {
  res.status(200).render('search');
});

app.get('/search_query', function (req, res) {
  res.status(200).render('search_query', {locs: titleArray});
});

app.post('/search_query', function (req, res, next){
  titleArray = [];
  var locationData = require('./searchLocations');
  
  if (req.body && req.body.longitude && req.body.latitude && req.body.max) {
    var rawjson = fs.readFileSync( __dirname + '/searchLocations.json');
    var locations = JSON.parse(rawjson);
  } else {
    res.status(400).send("Incomplete information, failed to write to server.");
  }
  
 
  var y = 0;
  for (var n = 0; n < locations.length; n++) {
    if (is_in_radius(0 + (+locations[n]['longitude']), 0 + (+locations[n]['latitude']), req.body.longitude, req.body.latitude, 6371000, false) == true) {
      console.log(locations[n]['title']);
      titleArray[y] = {title: locations[n]['title']};
      y = y + 1;
    }
  }
  
  res.status(200).render('search_query');
});

app.post('/report_bug/sendReport', function (req, res, next){
  var bugData = require('./bugData');
  
  if (req.body && req.body.title && req.body.ticket && req.body.summary) {
    bugData.push({
      title: req.body.title,
      ticket: req.body.ticket,
      summary: req.body.summary
    });
    fs.writeFile(
      __dirname + '/bugData.json',
      JSON.stringify(bugData, null, 2),
      function (err){
        if (!err){
          res.status(200).send();
        } else {
          res.status(500).send("Failed to write data on server side.");
        }
      }
    );
  } else {
    res.status(400).send("Incomplete information, failed to write to server.");
  }
})

var port = process.env.PORT || 50605;

app.listen(port, function() {
  console.log('== Server is listening on port', port);
});

function is_in_radius(from_theta, from_phi, to_theta, to_phi, max_distance, miles) {
    if (miles) {
        max_distance *= 1609;
    }
    if (get_distance(from_theta, from_phi, to_theta, to_phi, 6371000, false) <= max_distance) {
        return true;
    }
    else {
        return false;
    }
}

//this is an aproximation for angles less than 1 dgree
function get_distance(from_theta, from_phi, to_theta, to_phi, radius, radians) {
  var Fphi;
  var Ftheta;
  var Tphi;
  var Ttheta;

  if (radians) {
    Fphi = from_phi + Math.PI / 2;
    Ftheta = from_theta + Math.PI;
    Tphi = to_phi + Math.PI / 2;
    Ttheta = to_theta + Math.PI;
  }
  else {
    Fphi = from_phi + 90;
    Ftheta = from_theta + 180;
    Tphi = to_phi + 90;
    Ttheta = to_theta + 180;
  }

  phi = Math.abs(Fphi - Tphi);
  theta = get_smallest_angel(Ftheta, Ttheta, radians);

  if (!radians) {
    phi *= Math.PI / 180;
    theta *= Math.PI / 180;
  }

  return Math.pow(Math.pow(radius * phi, 2) + Math.pow(radius * theta, 2), .5);
}

function get_smallest_angel(angel_i, angel_f, radians) {
  var FR;
  var delta_angle;

  if (radians) {
    FR = 2 * Math.PI;
  }
  else {
    FR = 360;
  }

  delta_angle = Math.abs(angel_f - angel_i);

  if (delta_angle > FR / 2) {
    delta_angle = FR - delta_angle;
  }

  return delta_angle;
}