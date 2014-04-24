module.exports = [
    { "sayHello" : function(req, res){
                var body = 'Routes: ' + routes.length;
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Length', body.length);
                res.end(body);
            }},
    { "refreshRoutes" : function(req, res) {
                routes.forEach(function(route) {
                    app.get(route.path, eval(route.action)); 
                });
                var body = 'Refreshed';
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Length', body.length);
                res.end(body);
            }}
]

