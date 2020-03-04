var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir  : [
    //  path to your partials
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

app.post('/report_bug/sendReport', function (req, res, next){

  var bugData = require('./bugData');
  
  if (req.body && req.body.title && req.body.ticket && req.body.summary) {
    bugData.push({
      title: req.body.title,
      ticket: req.body.ticket,
      summary: req.body.summary
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

var port = process.env.PORT || 50505;

app.listen(port, function() {
  console.log('== Server is listening on port', port);
});
