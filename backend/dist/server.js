"use strict";

var express = require('express');
var path = require('path');
var app = express();
var port = 3000;
app.use(express["static"](path.join(__dirname, '../public')));
app.get('/api', function (req, res) {
  res.json({
    message: 'hello from backend'
  });
});
app.get('/{*any}', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.listen(port, function () {
  console.log("Server is running on http://localhost:".concat(port));
});