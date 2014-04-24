var terminal = require('node-terminal');
var Cluster = require('cluster');
var Sites = require('./Sites.js');
var Main = require('./Main/app.js');

/*
 * Load Sites
 * 
 * Use FS to determine installed Sites
 *
 * events: loaded
 * 
 */

if (Cluster.isMaster) {
    Sites.load();
    Sites.on('loaded', function (sites) {
        terminal.color('green').write('Loaded ' + sites.length + ' Sites.\n').reset();
    }); 
}

/*
 * Cluster Init
 *
 * Site data loading must be done at this point. Express servers are initialized in 
 * the else following the Cluster.fork(); 
 */
/*
function startCluster(sites) {
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
        sites.forEach(function(site) {
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
*/