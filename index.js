var express = require('express');
var app = express();
var port = 8000;

app.get('/', function(req, res){
  res.send('Welcome to the API! :)');
});

app.listen(port);
console.log("Server running on port "+port+".");
