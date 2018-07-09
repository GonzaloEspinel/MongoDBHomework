var scrape = require("../scripts/scrape");
var createDate = require("../scripts/date");

var Headline = require("../models/Headline");

module.exports ={
	gofecth: function(cb){
		scrape(function(data){
			console.log("here");
			//console.log(data);
			var articles = data;
			for (var i=0; i < articles.length; i++){
				articles[i].date = createDate();
				articles[i].saved = false;
			}
			//console.log(articles);
			Headline.collection.insertMany(articles, {}, function(err, docs){
				console.log(docs);
				cb(err,docs);
			});
		});
	},
	delete: function(query, cb) {
		Headline.remove(query, cb);
	},
	get: function(query, cb) {
		Headline.find(query)
		.sort({
			_id: -1
		})
		.exec( function(err, doc) {
			cb(doc);
		});
	},
	update: function(query, cb) {
		Headline.update({_id: query._id}, {
			$set: query
		}, {}, cb);
	}
};