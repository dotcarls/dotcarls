var ejs = require('ejs')
  , fs = require('fs')
  , path = __dirname + '/update.ejs'
  , str = fs.readFileSync(path, 'utf8');
  
var config = require('../../config.js');
var allInfo = "";
var configuration = "";
var routes = "";
var modules = "";

var root = { "path" : "/update",
             "name" : "Update Info",
             "action": function(req, res){
                    res.render('app', { content: "Update system data here" });
                }
    };

var gets = [
       {
              "path" : "/configuration",
              "name" : "Configuration",
              "action": function(req, res){
                            res.render('app', { content: configuration });
                        }
       }, 
       {
              "path" : "/routes",
              "name" : "Routes",
              "action": function(req, res){
                            res.render('app', { content: routes });
                        }
       },
       {
              "path" : "/modules",
              "name" : "Modules",
              "action": function(req, res){
                            res.render('app', { content: modules });
                        }
       }   
];

var posts = [
       {
              "path": "/routes",
              "name" : "Update routes",
              "action": function(req, res) {
                           
                            var databaseUrl = config.db;
                            var db = require('mongojs').connect(databaseUrl, ['routes']);
                           
                            db.routes.find({name: req.body.oldName}, function(err, route) {
                               if (err || !route) {
                                   console.log("Error fetching route.");
                               } else {
                                   db.routes.update( { name: req.body.oldName }, req.body, function(err, count) {
                                          if (err) {
                                                 res.render('app', { content: err });
                                          } else {
                                                 app.emit('rehash');
                                                 app.on('loaded', function() {
                                                        res.render('app', { content: "Success!"});
                                                 });
                                                 
                                          }
                                   });
                               }
                            });    
                            
                     }
       }
]

app.on('loaded', function() {
       allInfo = ejs.render(str, { config: config, routes: app.get('routes'), modules: app.get('modules') });
       configuration = ejs.render(str, { config: config });
       routes = ejs.render(str, { routes: app.get('routes') });
       modules = ejs.render(str, { modules: app.get('modules') });
});



exports.gets = gets;
exports.root = root;
exports.posts = posts;