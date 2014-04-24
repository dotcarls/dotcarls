var fs = require('fs');
var terminal = require('node-terminal');
var EventEmitter = require( "events" ).EventEmitter;
var express = require('express');

/******************************************
 * new Site(name)
 *
 * Takes a name and creates an express
 * instance to handle a sub site.
 *
 ******************************************/
function Site(name) {
    this.name = name;
    this.app = new express();
    this.app.get('/hello.txt', function(req, res){
        var body = 'Hello World';
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Length', body.length);
        res.end(body);
    });
    this.app.listen(3001);
}

var sites = new Array();
var Sites = new EventEmitter();

Sites.load = function() {
    terminal.color('blue').write('Loading Sites...\n').reset();
    fs.readdir('Sites/', function (err, files) {
        if (err) {
          terminal.color('red').write(err);
          return err;
        }
        files.forEach(function(file) {
            var site = new Site(file);
            console.log("File: " + file + "\n");
            sites.push(site);
        });
        Sites.emit('loaded', sites);
    }); 
}

module.exports = Sites;