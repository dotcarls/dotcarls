exports.sets = [
    { "variable" : "title",
      "value" : "CSCMS"
    },
    { "variable" : "port",
      "value" : process.env.PORT || 3000
    },
    { "variable" : "views",
      "value" : __dirname + "/layouts"
    },
    { "variable" : "view engine",
      "value" : "ejs"
    },
    { "variable" : "modules",
      "value" : []
    }
];

exports.uses = [
   { "variable" : "express.favicon()" },
   { "variable" : "express.logger('dev')" },
   { "variable" : "express.bodyParser()" },
   { "variable" : "express.methodOverride()" },
   { "variable" : "express.cookieParser('cookieSecret')" },
   { "variable" : "express.session()" },
   { "variable" : "app.router" },
   { "variable" : "express.static(path.join(__dirname, 'public'))" }
];

exports.db = "mongodb://cscms:cscms@linus.mongohq.com:10034/CSCMS";