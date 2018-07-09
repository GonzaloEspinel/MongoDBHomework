//Scrape
var scrape = require("../scripts/scrape");

//Brings headlines and notes from controllers
var headlinesController = require("../controllers/headline");
var notesController = require("../controllers/notes");

module.exports = function(router){
	//Home Page
	router.get("/", function(req, res){
		res.render("home");
	});
	//'Saved Page'
	router.get("/saved", function(req, res){
		res.render("saved");
	});

	router.get("/api/fetch", function(req, res){
		headlinesController.gofecth(function(err,docs){
			if(!docs || docs.insertedCount === 0) {
				console.log(docs);
				console.log(err);
				res.json({
					message: "No new articles today. Check back tomorrow!"
				});
			}
			else{
				res.json({
					message: "Added " + docs.insertedCount + " new articles"
				});
			}
		});
	});

	router.get("/api/headlines", function(req, res){
		var query = {};
		if (req.query.saved) {
			query = req.query;
		}

		headlinesController.get(query, function(data){
			res.json(data);
		});
	});

	router.delete("/api/headlines/:id", function(req, res){
		var query = {};
		query._id = req.params.id;
		headlinesController.delete(query, function(err, data){
			res.json(data);
		});
	});

	router.post("/api/headlines", function(req, res) {
		headlinesController.update(req.body, function(err, data){
			res.json(data);
		});
	});

	router.get("/api/notes/:headline_id?", function(req, res){
		var query = {};
		console.log(req.params.headline_id);
		if(req.params.headline_id) {
			query._id = req.params.headline_id;
		}
		console.log(query);

		notesController.get(query, function(err, data){
			res.json(data);
		});
	});

	router.delete("/api/notes/:id", function(req, res){
		var query = {};
		query._id = req.params.id;
		notesController.delete(query, function(err, data){
			res.json(data);
		});
	});

	router.post("/api/notes", function(req,res){
		notesController.save(req.body, function(data){
			res.json(data);
		});
	});
}