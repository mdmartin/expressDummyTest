
/*
 * GET home page.
 */


exports.index = function(req, res){
	var ArticleProvider = require('../articleprovider-mongodb').ArticleProvider;
	var articleProvider = new ArticleProvider();
	// console.log(articleProvider.db);
	articleProvider.findAll( function(err, docs) {
		res.render('index', {
			title: 'Posts',
			articles: docs
		});
	});
};

exports.blog_new = function(req, res) {
	res.render('blog_new.jade', {
        title: 'New Post'
    });
};

exports.post_blog_new = function(req, res) {
	var ArticleProvider = require('../articleprovider-mongodb').ArticleProvider;
	var articleProvider = new ArticleProvider();
	articleProvider.save({
		title: req.param('title'),
		body: req.param('body')
	}, function(err, docs){
		res.redirect('/');
	});
};

exports.blog_byId = function(req, res) {
	var ArticleProvider = require('../articleprovider-mongodb').ArticleProvider;
	var articleProvider = new ArticleProvider();
	articleProvider.findById(req.params.id, function(err, doc) {
		res.render('blog_show.jade', {title: doc.title, article: doc});
	});
};


exports.post_blog_comment = function(req, res) {
	var ArticleProvider = require('../articleprovider-mongodb').ArticleProvider;
	var articleProvider = new ArticleProvider();
	articleProvider.addComment(req.param('_id'),
		{
			person: req.param('person'),
			comment: req.param('comment'),
			created_at: new Date()
		}, function(err, docs) {
			res.redirect('/blog/' + req.param('_id'));
		});
}