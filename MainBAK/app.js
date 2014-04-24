var express = require('express');
var app = express();
var routes = require('./routes.js');
var actions = require('./actions.js');

routes.forEach(function(route) {
    console.log(route.action);
    console.log(actions["sayHello"]);
});

app.listen(3000);
module.exports = app;