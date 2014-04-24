var ejs = require('ejs')
  , fs = require('fs')
  , path = __dirname + '/info.ejs'
  , str = fs.readFileSync(path, 'utf8')
    , mongoose = require('mongoose')
    require('mongoose-function')(mongoose);

var config = require('../../config.js');
allInfo = ejs.render(str, { config: config, routes: app.get('routes') });   


var Path = mongoose.model('Path');
var Route = mongoose.model('Route');

// Check if Info Module has already been made
Route.findOne({name: 'Info'}, function(err, route) {
    if (route) {
        app.emit('info loaded');
    } else {
        infoRoute.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Default Info Saved');
                app.emit('info loaded');
            }
        }); 
    }
});

routes = Route.find(function(err, routes){
       return routes;
});

var rootAction = function(req, res){
                    res.render('app', { content: "Here is where you view system info.", routes: app.get('routes') });
                };
var allAction = function(req, res){
                    res.render('app', { content: allInfo, routes: app.get('routes') });
                };
                
var infoRoot = new Path({ path: "/info", navname: "Info", type: "get", action: rootAction });
var infoAll = new Path({ path: "/info/all", navname: "All Info", type: "get", action: allAction });

var infoRoute = new Route({
    name: "Info",
    paths: [infoRoot, infoAll],
    hidden: false,
    type: "module"
});
