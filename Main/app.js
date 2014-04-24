/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , jsonfn = require('jsonfn')
  , fs = require('fs')
  , mongoose = require('mongoose')
    require('mongoose-function')(mongoose);

app = express();


/**
 * See config.js 
 */
var config = require('./config.js');

mongoose.connect('mongodb://cscms:cscms@linus.mongohq.com:10034/CSCMS');

app.configure(function(){
  // Check configuration for app.set options
  config.sets.forEach(function(set) {
    app.set(set.variable, set.value);
  });
  // Check configuration for app.get options
  config.uses.forEach(function(use) {
    app.use(eval(use.variable));
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



/****
 *
 * Set up Path and Route and instantiate a default.
 *
 **/
var pathSchema = new mongoose.Schema({
    path: String,
    navname: String,
    type: String,
    action: Function
});
var Path = mongoose.model('Path', pathSchema);

var routeSchema = new mongoose.Schema({
    name: String,
    paths: [pathSchema],
    module: String,
    hidden: Boolean
});
var Route = mongoose.model('Route', routeSchema);

var defaultFunction = function(req, res){
    res.render('app', { content: 'Hello. This is CSCMS, made for CSCI-A348', jumbotron: true, routes: app.get('routes')});
}
var defaultPath = new Path({ path: "/", navname: "Home", type: "get", action: defaultFunction });
var defaultRoute = new Route({
    name: "Default",
    paths: [defaultPath],
    hidden: false
});


// Check if Default has already been made
Route.findOne({name: 'Default'}, function(err, route) {
    if (route) {
        app.emit('default loaded');
    } else {
        defaultRoute.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Default Route Saved');
                app.emit('default loaded');
            }
        }); 
    }
});

app.on('default loaded', function() {
    fs.readdir('Main/modules/', function(err, files) {
        if (err) {
          console.log(err);
          return err;
        }
        files.forEach(function(file) {
            require('./modules/' + file + '/' + file + '.js');
        });
    });
});

// Load all routes
app.on('info loaded', function() {
    Route.find(function(err, routes) {
        if (err || !routes) {
            console.log("Error fetching routes.");
        } else {
            //console.log("Found Routes: " + routes);
            app.set('routes', routes);
            routes.forEach(function(route) {
                   
                    //console.log(route.paths[0].path);
                    route.paths.forEach(function(path) {
                        console.log(path);
                        switch (path.type) {
                            case "get": app.get(path.path, path.action);
                                break;
                            case "post": app.post(path.path, path.action);
                                break;
                        }
                    }); 
                
            });
        }
    }); 
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});