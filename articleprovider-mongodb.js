var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


var ArticleProvider = function() {
	
};
ArticleProvider.prototype.db = new Db('node-mongo-blog', new Server('localhost', 27017, {auto_reconnect: true}), {});
// console.log(ArticleProvider.prototype.db);


ArticleProvider.prototype.getCollection = function(callback) {
	this.db.collection('articles', function(err, article_collection) {
		if (err) callback(err);
		else {
			callback(null, article_collection);
		}
	});
};

ArticleProvider.prototype.findAll = function(callback) {
	this.getCollection(function (err, article_collection) {
		if (err) callback(err);
		else {
			article_collection.find().toArray(function (err, docs) {
				if (err) {
					console.log('err');
					callback(err);
				}
				else {
					console.log('in');
					callback(null, docs);
				}
			});
		}
	});
}

ArticleProvider.prototype.findById = function(id, callback) {
	this.getCollection(function (err, article_collection) {
		if (err) callback(err);
		else {
			article_collection.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function (err, doc) {
				if (err) callback(err);
				else {
					callback(null, doc);
				}
			});
		}
	});
};

ArticleProvider.prototype.save = function(articles, callback) {
	this.getCollection(function(err, article_collection) {
		if (err) callback(err);
		else {
			if (typeof (articles.length) == 'undefined') {
				articles = [articles];
			}

			for (var i = 0; i < articles.length; i++) {
				var article = articles[i];
				article.created_at = new Date();
				if (article.comments == undefined) article.comments = [];
				else {
					for (var j = 0; j < article.comments.length; j++) {
						article.comments[j].created_at = new Date();
					}
				}
			}
			article_collection.insert(articles, function(err, res) {
				// console.log(articles);
				console.log(res);
				callback(null, articles);
			})
		}
	});
};

ArticleProvider.prototype.addComment = function(artId, comment, callback) {
	this.getCollection(function(err, article_collection) {
		if (err) callback(err);
		else {
			article_collection.update(
				{_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(artId)},
				{"$push": {comments: comment}},  
				function(err, article) {
				if (err) callback(err);
				else {
					callback(null, article);
				}
			});
		}
	});
};



exports.ArticleProvider = ArticleProvider;
