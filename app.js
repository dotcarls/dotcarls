var async = require('async');
var fs = require('fs');
var terminal = require('node-terminal');
var Cluster = require('cluster');
var express = require('express');

/*
 * Load Sites
 * 
 * Use FS to determine installed Sites
 *
 * 
 */


function Site(name) {
    this.name = name;
    this.app = express();
}

var Sites = new Array();

if(Cluster.isMaster) {
    terminal.color('blue').write('Loading Sites...\n').reset();
    fs.readdir('Sites/', function (err, files) {
        if (err) {
          terminal.color('red').write(err);
          return;
        }
        for(i=0; i < files.length; i++) {
            var newSite = new Site(files[i]);
            Sites.push(newSite);
            if (Sites.length == files.length) {
                terminal.color('green').write(Sites.length).reset().write(" Sites loaded.\n");
                loadedSites = true;
                startCluster();
            }
        };
    });
}


/*
 * Cluster Init
 *
 * Site data loading must be done at this point. Express servers are initialized in 
 * the else following the Cluster.fork(); 
 */

function startCluster() {
    var numCPUs = require('os').cpus().length;
    // http://nodejs.org/api/Cluster.html#Cluster_Cluster
    if (Cluster.isMaster) {
      // Fork workers.
      for (var i = 0; i < numCPUs; i++) {
        Cluster.fork();
      }
    
      Cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
      });
    } else {
      // Workers can share any TCP connection
      // In this case its a HTTP server
      Sites.forEach(function(site) {
        terminal.color('blue').write(site.name).reset().write(" Express Server starting.\n");
        site.app.get('/hello.txt', function(req, res){
            res.send('Hello World');
        });
        site.app.listen(3000);
      });
    }
    
    var timeouts = [];
    
    function errorMsg() {
      console.error("Something must be wrong with the connection ...");
    }
    
    Cluster.on('fork', function(worker) {
      console.log('Worker Forked.');
    });
    
    
    Cluster.on('exit', function(worker, code, signal) {
      console.log('Worker Quit.');
    });
    
    Cluster.on('online', function(worker) {
      console.log("Worker Online.");
    });
}
