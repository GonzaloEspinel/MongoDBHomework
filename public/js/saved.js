$(document).ready(function(){
	$('.sidenav').sidenav();
	$('textarea#icon_prefix2').characterCounter();

	var articleContainer = $(".articleContainer");

	$(document).on("click", ".articleDelete", articleDelete);
	$(document).on("click", ".articleNotes", articleNotes);
	$(document).on("click", ".articleNoteSave", articleNoteSave);
	$(document).on("click", ".articleNoteDel", articleNoteDel);

	initPage();

	function initPage(){

		articleContainer.empty();
		$.get("/api/headlines?saved=true").then(function(data){
			if(data && data.length) {
				renderArticles(data);
			}
			else{
				renderEmpty();
			}
		});
	}

	function renderArticles (articles){
		var articlePanels = [];

		for(var i = 0; i < articles.length; i++){
			articlePanels.push(createPanel(articles[i]));
		}
		articleContainer.append(articlePanels);
	}

	function createPanel(article){
		var panel = 
		$([
			'<div class="row panel hoverable z-depth-5" id="',article._id,'">',
				'<div class="card grey darken-3">',
					'<div class="card-content white-text">',
						'<span class="card-title">', article.headline, '</span>',
					'</div>',
					'<div class="card-action center-align">',
						'<a target="_blank" class="waves-effect waves-light btn-large blue lighten-1" href="', article.aUrl,'"><i class="material-icons">arrow_upward</i>  Go To Article</a>',
						'<a data-target="modal1" class="modal-trigger waves-effect waves-light btn-large blue lighten-1 articleNotes"><i class="material-icons">add_circle</i>  Article Notes</a>',
						'<a class="waves-effect waves-light btn-large deep-orange darken-4 articleDelete"><i class="material-icons">delete_forever</i>  Delete From Saved</a>',
					'</div>',
				'</div>',
			'</div>'
		  ].join(''));

		panel.data("_id", article._id);

		return panel;
	}

	function renderEmpty(){
		var emtpyAlert = $([
			'<div class="row panel">',
				'<div class="card grey darken-3">',
					'<div class="card-content white-text deep-orange darken-4">',
						'<span class="card-title center-align">Sorry, No Articles Found</span>',
					'</div>',
				'</div>',
			'</div>'
			].join(''));
		articleContainer.append(emtpyAlert);
	}

	function articleDelete() {

		var articleToDel = $(this).parents(".panel").attr('id');
		console.log(this);

		$.ajax({
			method: "DELETE",
			url: "/api/headlines/" + articleToDel
		}).then(function(data){

			if(data.ok){
				initPage();
			}
		});
	}

	function articleNotes(){

		var currentArticle = $(this).parents(".panel").data();

		$.get("/api/notes/" + currentArticle._id).then(function(data){

			var modalText = [
				'<div id="modal1" class="modal">',
					'<div class="container">',
						'<div class="modal-content">',
							'<ul class="collection">',
							'</ul>',
						'</div>',
						'<div class="input-field col s6">',
							'<i class="material-icons prefix">mode_edit</i>',
							'<textarea data-length="100" id="icon_prefix2" class="materialize-textarea"></textarea>',
							'<label for="icon_prefix2">Add Note</label>',
						'</div>',
						'<div class="modal-footer">',
							'<a class="btn-small waves-effect waves-light blue lighten-1 articleNoteSave" id="savenote">Save Note',
							'<i class="material-icons right">send</i>',
							'</a>',
						'</div>',
					'</div>',
				'</div>'
			].join('');
			$(".articleContainer").append(modalText);
			$('textarea#icon_prefix2').characterCounter();
			var noteData = {
				_id: currentArticle._id,
				notes: data || []
			};

			$("a.articleNoteSave").data("article", noteData);

			renderNotesList(noteData);
		});
	}

	function renderNotesList(data){
		var notesToRender = [];
		var currentNote;
		$('.collection').empty();
		$('#icon_prefix2').val(' ');
		if(!data.notes.length){
			currentNote = [
					'<li class="collection-item avatar">',
						'<p>No notes for this article yet.</p>',
					'</li>'
				].join('');
				notesToRender.push(currentNote);
		}else{
			for (var i = 0; i < data.notes.length; i++){

				currentNote = $([
						'<li id="', data.notes[i]._id, '" class="collection-item avatar">',
							'<p>', data.notes[i].noteText, '</p>',
							'<a" id="', data.notes[i]._id, '" class="secondary-content articleNoteDel">',
								'<i class="material-icons">delete_forever</i>',
							'</a>',
						'</li>'
					].join(''));
				currentNote.children('a').data("_id", data.notes[i]._id);
				notesToRender.push(currentNote);
			}
		}
		$(".collection").append(notesToRender);
		$('.modal').modal();
		$('#modal1').modal('open');
	}

	function articleNoteSave() {
		var noteData;
		var newNote = $("#icon_prefix2").val().trim();

		if(newNote){
			noteData = {
				_id: $(this).data("article")._id,
				noteText: newNote
			};
			$.post("/api/notes", noteData).then(function(){
				$('.modal').modal('close');
			});
		}
	}
	function articleNoteDel(){
		var noteToDel = $(this).attr('id');
		console.log("here to delete")

		$.ajax({
			url: "/api/notes/" + noteToDel,
			method: "DELETE",
			success: function (result){
						$('#modal1').modal('close');
						$('#' + noteToDel).empty();
					 }
		});
	}

});