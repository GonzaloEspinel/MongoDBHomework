var request = require("request");
var cheerio = require("cheerio");


//class=title

var scrape = function (cb) {

	request("http://www.bbc.com/", function(err, res, body){
		var $ = cheerio.load(body);
		//console.log(body);

		var articles = [];

		$("a.title").each(function(i,element){
			var head = $(element).text();
			var arUrl = $(this).attr("href");
			if(head && arUrl){
				var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

				var dataToAdd = {
					headline: head,
					aUrl: arUrl
				};
				articles.push(dataToAdd);
				console.log((dataToAdd));
			}
		});
		return cb(articles);
	});
};

module.exports = scrape;