//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

//Set up for Port use condition either host to be designated or 3000
var PORT = process.env.PORT || 3000;

//Express App
var app = express();

//Express Router
var router = express.Router();

//routes passing router
require("./config/routes")(router);

//Public Folder Rendering (static files)
app.use(express.static(__dirname + "/public"));

//Handlebars connection to Exptress
app.engine("handlebars", expressHandlebars({
	"defaultLayout": "main"
}));
app.set("view engine", "handlebars");

//bodyParser App
app.use(bodyParser.urlencoded({
	extended: false
}));

//Request funneling to Router
app.use(router);

//Enviromentally aware DB.
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//Connecting init and handler
mongoose.Promise = Promise;
mongoose.connect(db, function(error){
	//Error
	if(error){
		console.log(error);
	}
	else{
		console.log("mongoose is connected to mongo");
	}
})

//Port Listening
app.listen(PORT, function(){
	console.log("Listening on port: " + PORT);
});