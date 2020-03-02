var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

var campaignData = require('./campaignData');

var app = express();
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    partialsDir  : [
        //  path to your partials
        path.join(__dirname, 'views/partials'),
    ]}));
app.set('view engine', 'handlebars');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());

function writeToFile() {
  fs.writeFile(
    __dirname + '/campaignData.json',
    JSON.stringify(campaignData, null, 2),
    function (err){
      if (!err){
        res.status(200).send();
      } else {
        res.status(500).send("Failed to write data on server side.");
      }
    }
  );
}

//Post a new campaign idea
app.post('/newPost/sendPost', function (req, res, next){
  //console.log(req.body);
  if (req.body && req.body.title && req.body.imageURL && req.body.summary && req.body.description && req.body.tags) {
    campaignData.push({
      title: req.body.title,
      summary: req.body.summary,
      imageURL: req.body.imageURL,
      description: req.body.description,
      tags: req.body.tags,
      comments: new Array,
      index: campaignData.length
    });

    fs.writeFile(
      __dirname + '/campaignData.json',
      JSON.stringify(campaignData, null, 2),
      function (err){
        if (!err){
          res.status(200).send(String(campaignData.length - 1));
        } else {
          res.status(500).send("Failed to write data on server side.");
        }
      }
    );
  } else {
    res.status(400).send("Incomplete information, failed to write to server.");
  }
})

//Post a new comments
app.post('/post:number/addComment', function (req, res, next) {
  //console.log('req.body: ', req.body);
  var num = Number(req.params.number);
  //console.log('req.params.number: ', req.params.number);
  if (req.body && req.body.text && campaignData[num]){
    campaignData[num].comments.push({
      value: 0,
      text: req.body.text,
      index: campaignData[num].comments.length
    });
    console.log('campaignData[num]: ', campaignData[num]);
    fs.writeFile(
      __dirname + '/campaignData.json',
      JSON.stringify(campaignData, null, 2),
      function (err){
        if (!err){
          res.status(200).send();
        } else {
          res.status(500).send("Failed to write data on server side.");
        }
      }
    );

  } else {
    res.status(400).send("Incomplete information, failed to write to server");
  }

})

//add one to a comment
app.post('/post:number/upvote', function (req , res, next) {
  var num = Number(req.params.number);
  if (req.body && req.body.index && campaignData[num]){
    var value = Number(campaignData[num].comments[req.body.index].value);
    value++;
    campaignData[num].comments[req.body.index].value = value;
    fs.writeFile(
      __dirname + '/campaignData.json',
      JSON.stringify(campaignData, null, 2),
      function (err){
        if (!err){
          res.status(200).send();
        } else {
          res.status(500).send("Failed to write data on server side.");
        }
      }
    );

  } else {
    res.status(400).send("Something went wrong! Upvote failed.");
  }
})

//sub one from a comment
app.post('/post:number/downvote', function (req , res, next) {
  var num = Number(req.params.number);
  if (req.body && req.body.index && campaignData[num]){
    var value = Number(campaignData[num].comments[req.body.index].value);
    value--;
    campaignData[num].comments[req.body.index].value = value;
    fs.writeFile(
      __dirname + '/campaignData.json',
      JSON.stringify(campaignData, null, 2),
      function (err){
        if (!err){
          res.status(200).send();
        } else {
          res.status(500).send("Failed to write data on server side.");
        }
      }
    );

  } else {
    res.status(400).send("Something went wrong! Upvote failed.");
  }
})

//Home Page
app.get('/', function(req, res){
  res.status(200).render('indexTemplate', {campaignData: campaignData});
})

//Get individual post page
app.get('/post:number', function (req, res, next) {
  pageNum = Number(req.params.number);
  console.log('pageNum: ',pageNum);
  console.log('campaignData[pageNum]: ', campaignData[pageNum] );
  if (pageNum >= 0 && Number.isInteger(pageNum) && pageNum < campaignData.length){
    res.status(200).render('postPage', campaignData[pageNum]);
  } else {
    next();
  }
})

//Page with the form for a new campaign idea
app.get('/newPost', function(req, res){
  res.status(200).render('newPost');
})

//Serve static file(pictures, css, etc)
app.use(express.static('public'));
app.use(express.static('post'));

//404, page not found
app.get('*', function (req, res) {
  res.status(404).render('404');
  //res.sendFile(__dirname + '/public/404.html');
  console.log(req.url);
  // console.log(res);
  //res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, function() {
  console.log('== Server is listening on port', port);
});
