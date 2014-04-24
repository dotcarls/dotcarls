module.exports = {
    "sayHello" : function(req, res){
        res.render('app', { content: 'Hello' });
    },
    "sayGoodbye" : function(req, res){
        res.render('app', { content: 'Goodbye' });
    }
}
