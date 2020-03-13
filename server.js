var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');

var logindata = require("./loginData");

var titleArray = [];

//Custom status codes
//460: Username taken
//461: Password and Confirm Password dont match
//462: One or more fields are not filled
//463: No request body

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir  : [
    //  path to your partials
    path.join(__dirname, 'views/partials'),
  ]
}));

app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(session({
  secret: 'janck',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//-----------Login

app.get('/', function (req, res) {
  if (req.session.loggedin){
    res.status(200).render('success');
  } else {
    res.status(200).render('frontPage');
  }
});

app.get('/login', function (req, res) {
  res.status(200).render('login');
})

app.get('/success', function (req, res) {
  if (req.session.loggedin){
    res.status(200).render('success');
  } else {
    res.status(300).redirect('/');
  }
});


app.post('/auth', function (req, res){
  var username = req.body.username;
  var password = req.body.password;
  console.log(req.body);
  console.log(username);
  console.log(password);
  if (username != '' && password != '') {
    loginData = require('./loginData');
    found = false;
    for(i = 0; i < loginData.length; i++){
      if(username == loginData[i].username &&
      password == loginData[i].password){
        found = true;
      }
    }
    if (found == true){
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect('/success');
    } else {
      res.status(460).send();
    }
    //res.end();
  } else {
   res.status(461).send();
   //res.end();
  }
});

//------------Bug Reporting----------

app.get('/report_bug', function (req, res) {
  if (req.session.loggedin){
    res.status(200).render('bugReport');
  } else {
    res.status(300).redirect('/');
  }
});

app.post('/report_bug/sendReport', function (req, res, next){

  var bugData = require('./bugData');

  if (req.body && req.body.title && req.body.ticket && req.body.summary) {
    bugData.push({
      title: req.body.title,
      ticket: req.body.ticket,
      summary: req.body.summary,
      username: req.session.username
      //index: bugData.length
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

//------------Add Vehicle----------

app.get('/add_Vehicle', function (req, res) {
  if(req.session.loggedin){
    res.status(200).render('addVehicle');
  } else {
    res.status(300).redirect('/');
  }
});

app.post('/add_Vehicle/saveVehicle', function (req, res, next){

  var allVehicles = require('./vehicles');

  if (req.body && req.body.Make && req.body.Model && req.body.Year && req.body.Plate) {
    allVehicles.push({
      Username: req.session.username,
      Make: req.body.Make,
      Model: req.body.Model,
      Year: req.body.Year,
      Plate: req.body.Plate


      //index: bugData.length
    });
    fs.writeFile(
      __dirname + '/vehicles.json',
      JSON.stringify(allVehicles, null, 2),
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

//----------Search-----------------

app.get('/search', function (req, res) {
  if(req.session.loggedin){
    res.status(200).render('search');
  } else {
    res.status(300).redirect('/');
  }
});

app.get('/search_query', function (req, res) {
  if(req.session.loggedin){
    res.status(200).render('search_query', {locs: titleArray});
  } else {
    res.status(300).redirect('/');
  }
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

//-----------Create a simple account ----------------

app.get('/Create_Simple_Account', function (req, res, next) {
    res.status(200).render("Create_Simple_Account");
})

app.post('/Create_A', function (req, res, next) {
    if (req.body) {
        var email = req.body.username;
        var pass = req.body.password;
        var repass = req.body.confirm_password;
        if (email != '' && pass != '' && repass != '') {
            if (pass == repass) {
                var namefree = true;
                for (var i = 0; i < logindata.length; i++){
                    if (logindata[i].username == email) {
                        namefree = false;
                    }
                }

                if (namefree) {
                    logindata.push({ "username": email, "password": pass });
                    fs.writeFile(
                        __dirname + '/loginData.json',
                        JSON.stringify(logindata, null, 2),
                        function (err) {
                            if (!err) {
                                res.status(200).send();
                            } else {
                                res.status(500).send("Failed to write data on server side.");
                            }
                        }
                    );
                }
                else {
                    //console.log("name not free");
                    res.status(460).send();
                }
            }
            else {
                //console.log("pass not match");
                //console.log(pass);
                //console.log(repass);
                res.status(461).send();
            }
        }
        else {
            //console.log("field empty");
            res.status(462).send();
        }
    }
    else {
        //console.log("no body");
        res.status(463).send();
    }
})


var port = process.env.PORT || 50555;

app.listen(port, function() {
  console.log('== Server is listening on port', port);
});


//----------Search Functions---------------
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
