



function bookmarkOption(){

	//THIS FUNCTION IS TO RELOAD THE PAGE TO UNDO THE SEARCH BY TITLE

	let reset = document.getElementById('submitReset');
		reset.addEventListener('click', (event) =>{

			location.reload();

			
			});

	//SEARCH BY TITLE
	let search = document.getElementById('search');
		search.addEventListener('submit', (event) =>{

			event.preventDefault();

				let url = 'http://localhost:8080/api/bookmark?title='+document.getElementById('title').value;
				let settings = {
					method : "GET"
				}
				fetch(url, settings)
					.then(response => {
						if(response.ok){
							return response.json();
						}
					})
					.then(responseJSON => {
						displayResults(responseJSON);
					});
			
		});

	//ADD A NEW BOOKMARK

	let newBookmark = document.getElementById('submitN');
		newBookmark.addEventListener('click', (event) =>{

			event.preventDefault();

			let title = document.getElementById('newT').value;
			let description = document.getElementById('newD').value;
			let link = document.getElementById('newW').value;
			let rating = document.getElementById('newR').value;

			if(title!=""&& description!=""&& link !=""&& rating !=""){

				let url = 'http://localhost:8080/api/bookmarks';
				
				let bodyJSON = {
					"title" : title,
					"description" : description,
					"url" : link,
					"rating" : rating
				}
				let settings = {
					method : "POST",
					body : JSON.stringify(bodyJSON),
					headers:{
    					'Content-Type': 'application/json'
  					}
				}
				fetch(url, settings)
					.then((response)=>{
						if(response.ok){
							return response.json();
					}

					throw new Error(response.statusText);
				})
				.then((responseJSON)=>{
					bookmarksAll();
				});
			}
			document.getElementById('newB').reset();
		});

	//DELETE BOOKMARK

	let deleteBookmark = document.getElementById('submitD');
		deleteBookmark.addEventListener('click', (event) =>{

				event.preventDefault();

				let url = 'http://localhost:8080/api/bookmark?id='+document.getElementById('deleteId').value;
				let settings = {
					method : "DELETE",
				}
				fetch(url, settings)
					.then((response)=>{
						if(response.ok){
							return response.json();
					}

					throw new Error(response.statusText);
				})
				.then((responseJSON)=>{
					bookmarksAll();
				});
			document.getElementById('deleteB').reset();
		});

	//UPDATE BOOKMARK

	let updateB = document.getElementById('submitB');
		updateB.addEventListener('click', (event) =>{

			event.preventDefault();

			let url = 'http://localhost:8080/api/bookmark?id='+document.getElementById('updateId').value;

			let id = document.getElementById('updateId').value;

			let bodyJSON = { "id" : id };


			if ( document.getElementById('updateT').value != ""){

				let title = document.getElementById('updateT').value;
				bodyJSON.title = title;
			}

			if ( document.getElementById('updateD').value != ""){

				let description = document.getElementById('updateD').value;
				bodyJSON.description = description;
			}

			if ( document.getElementById('updateU').value != ""){

				let web = document.getElementById('updateU').value;
				bodyJSON.url = web;
			}

			if ( document.getElementById('updateR').value != ""){

				let rating = document.getElementById('updateR').value;
				bodyJSON.rating = rating;
			}
			

			let settings = {
				method : "PATCH",
				body : JSON.stringify(bodyJSON),
				headers:{
    				'Content-Type': 'application/json'
  				}
			}
			fetch(url, settings)
				.then((response)=>{
					if(response.ok){
						return response.json();
				}
					throw new Error(response.statusText);
				})
				.then((responseJSON)=>{
					bookmarksAll();
				});

				document.getElementById('updateB').reset();
		});

}

function bookmarksAll(){

	let url = 'http://localhost:8080/api/bookmarks';

	let settings = {
		method : "GET"
	}
	fetch(url, settings)
		.then(response => {
			if(response.ok){
				return response.json();
			}
		})
		.then(responseJSON => {
			displayResults(responseJSON);
		});
}

function displayResults(responseJSON){


	let bookmarks = document.getElementById('bookmarks');
	bookmarks.innerHTML= "";

	//THIS IF IS WHEN THE RESPONSE JSON ONLY HOLDS ONE VALE AND ITS NOT PASS AS AN ARRAY

	if ( responseJSON.length == undefined ){

		let id = responseJSON.id;
		let description = responseJSON.description;
		let title = responseJSON.title;
		let url = responseJSON.url;
		let rating = responseJSON.rating;

		

		let jump0 = document.createElement("div");
		let jump1 = document.createElement("div");
		let jump2 = document.createElement("div");
		let jump3 = document.createElement("div");
		let jump4 = document.createElement("div");
		let space = document.createElement("p");


		bookmarks.append(jump0);
		bookmarks.append("ID : ");
		bookmarks.append(id);

		bookmarks.append(jump1);
		bookmarks.append("TITLE : ");
		bookmarks.append(title);

		bookmarks.append(jump2);
		bookmarks.append("DESCRIPTION : ");
		bookmarks.append(description);

		bookmarks.append(jump3);
		bookmarks.append("URL : ");
		bookmarks.append(url);

		bookmarks.append(jump4);
		bookmarks.append("RATING : ");
		bookmarks.append(rating);

		bookmarks.append(space);

	}else 
	{
		for(let i=0; i<responseJSON.length; i++){

			let id = responseJSON[i].id;
			let description = responseJSON[i].description;
			let title = responseJSON[i].title;
			let url = responseJSON[i].url;
			let rating = responseJSON[i].rating;

		

			let jump0 = document.createElement("div");
			let jump1 = document.createElement("div");
			let jump2 = document.createElement("div");
			let jump3 = document.createElement("div");
			let jump4 = document.createElement("div");
			let space = document.createElement("p");


			bookmarks.append(jump0);
			bookmarks.append("ID : ");
			bookmarks.append(id);

			bookmarks.append(jump1);
			bookmarks.append("TITLE : ");
			bookmarks.append(title);

			bookmarks.append(jump2);
			bookmarks.append("DESCRIPTION : ");
			bookmarks.append(description);

			bookmarks.append(jump3);
			bookmarks.append("URL : ");
			bookmarks.append(url);

			bookmarks.append(jump4);
			bookmarks.append("RATING : ");
			bookmarks.append(rating);

			bookmarks.append(space);
		
		}
	}
}

function init(){

	bookmarksAll();
	bookmarkOption();
	
}
init();
