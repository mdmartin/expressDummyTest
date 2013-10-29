
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var Db = require('mongodb').Db;

var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// console.log(ArticleProvider.db);
ArticleProvider.prototype.db.open(function() {});

// var articleProvider= new ArticleProvider('localhost', 27017);
// console.log(articleProvider.dummyData);
app.get('/', routes.index);

// app.get('/', function(req, res){
//   articleProvider.findAll(function(error, docs){
//       res.send(docs);
//   });
// })

app.get('/blog/new', routes.blog_new);

app.get('/blog/:id', routes.blog_byId);

app.post('/blog/new', routes.post_blog_new);

app.post('/blog/addComment', routes.post_blog_comment);

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
