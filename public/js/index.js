$(document).ready(function(){
	$('.sidenav').sidenav();
	$('textarea#icon_prefix2').characterCounter();
	var articleContainer = $(".articleContainer");
	$(document).on("click", ".btn-save", handleSave);
	$(document).on("click", ".srappeNew", handleScrappe);
	
	initPage();
	
	function initPage(){
		articleContainer.empty();
		$.get("/api/headlines?saved=false")
			.then(function(data){
				if(data && data.length) {
					renderArticles(data);
				}
				else{
					renderEmpty();
				}
			}); 
	}
	
	function renderArticles(articles){
		var articleBoxes = [];
	
		for (var i = 0; i < articles.length; i++){
			articleBoxes.push(createBoxes(articles[i]));
		}
	
		articleContainer.append(articleBoxes);
	}
	
	function createBoxes(article){
		console.log(article);
		var boxArticle = $([
			"<div class='row panel hoverable z-depth-5'>",
				"<div class='card grey darken-3'>",
					"<div class='card-content white-text'>",
						"<span class='card-title'>",
							article.headline,
						"</span>",
					"</div>",
					"<div class='card-action center-align'>",
						"<a target='_blank' class='waves-effect waves-light btn-large blue lighten-1' href='",
							article.aUrl,
						"'><i class='material-icons'>arrow_upward</i>  Go To Article</a>",
						"<a class='waves-effect waves-light btn-large deep-orange darken-4 btn-save'><i class='material-icons'>add_circle</i>  Save Article</a>",
					"</div>",
				"</div>",
			"</div>"
			].join(""));
		boxArticle.data("_id", article._id);
		return boxArticle
	}
	
	function renderEmpty(){
		var alert = $([
			"<div class='row'>",
			"<div class='card grey darken-3'>",
			"<div class='card-content white-text deep-orange darken-4'>",
			"<span class='Card-title center-align'>Sorry, No News Articles Found</span> ",
			"</div>",
			"</div>",
			"</div>"
			].join(""));
		articleContainer.append(alert);
	}
	
	function handleSave() {
		var articleToSave = $(this).parents(".panel").data();
		articleToSave.saved = true;
	
		$.ajax({
			method: "POST",
			url: "/api/headlines",
			data: articleToSave
		})
		.then(function(data){
			if(data.ok){
				initPage();
			}
		});
	}
	
	function handleScrappe(){
		$.get('/api/fetch')
			.then(function(data){
				initPage();
				//'To insert alert for user of how many unique articles we were able to save'
			});
	}
	
	});