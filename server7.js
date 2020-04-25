
const express = require('express');
let bodyParser = require( 'body-parser' );
let jsonParser = bodyParser.json();
let morgan = require('morgan');
let uuid = require( 'uuid' );


const app = express();

const API_TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

app.use( morgan( 'dev' ) );


//MIDDLEWARE FOR VALIDATE THE APIKEY 2abbf7c3-245b-404f-9473-ade729ed4653

function validateApi( req, res, next){

	console.log("inside MIDDLEWARE");

	let token = req.headers.authorization;

	let tokenA = req.query.apiKey;

	let tokenB = req.headers.bookapikey;

	if ( tokenA == API_TOKEN){

		next();
	}


	if ( tokenB == API_TOKEN){

		next();
	}

	if ( !token ){

		res.statusMessage = "The authorization APIKEY is missing";
		return res.status(401).end();
	}


	if ( token != `Bearer ${API_TOKEN}` ){

		res.statusMessage = "The authorization APIKEY does not MATCH";
		return res.status(401).end();

	}

	next();
}

//USE THE VALIDATE FOR ALL THE APPS

app.use( validateApi );

let bookmList = [

	{
		id : "PRUEBA",
		title : "SITE NAME",
		description: "WEBSITE",
		url : "https://www.prueba.com/",
		rating : 10
	},
	{
		id : uuid.v4(),
		title : "Youtube",
		description: "VIDEO STREAMING WEBSITE",
		url : "https://www.youtube.com/",
		rating : 10
	},
	{
		id : uuid.v4(),
		title : "Facebook",
		description: "Social website to share photos",
		url : "https://www.facebook.com/",
		rating : 9

	}
];

// GET THE ALL BOOKMARKS 

app.get('/api/bookmarks',(req,res) =>{


	return res.status( 200 ).json(bookmList);
});


//GET A BOOKMARK BY TITLE IN THE QUERY

app.get('/api/bookmark',(req,res) =>{


	let title = req.query.title;

	if ( title === undefined){

		res.statusMessage = "Missing the bookmark TITLE"
		return res.status( 406 ).end();
	}

	let result = bookmList.find( ( bookmark ) => {


		if (bookmark.title == title){

			return bookmark;
		}
	});

	if ( !result ){

		res.statusMessage = "The title does not exists"
		return res.status( 404 ).end();
	}

	return res.status( 200 ).json({result});
});

//POST A NEW BOOK MARK 

app.post('/api/bookmarks', jsonParser ,(req,res) =>{

	let title = req.body.title;
	let description = req.body.description;
	let url = req.body.url;
	let rating = req.body.rating;


	if ( title == undefined || description == undefined || url == undefined || rating == undefined){

		res.statusMessage = "It is missing a parameter";
		return res.status( 406 ).send();
	}

	let id = uuid.v4();

	let newBM = {

		id : id,
		title : title,
		description : description,
		url : url,
		rating : rating
	}

	bookmList.push( newBM );

	console.log(newBM);

	return res.status(201).json(newBM);
		
});

//DELETE A BOOKMARK


app.delete('/api/bookmark',(req,res) =>{

	let idDelete = req.query.id;

		 let result = bookmList.find( (element) => {

			if (element.id == idDelete){

				
				return element;
			}
		
		});

		 if (result){

		 	bookmList = bookmList.filter((element) => {

		 		if ( result.id != element.id){
		 			return element
		 		}
		 	});

		 		bookmList.splice(idDelete,1); 
		 		return res.status(200).json({});
		 }else{

		 	res.statusMessage = "ID does NOT exists.";
		 	return res.status(404).json({})
		 }

	
});

//PATCH TO UPDATE AN ELEMENT FINDING BY THE ID 

app.patch('/api/bookmark/:id',jsonParser,(req,res) =>{

	
	let idBody = req.body.id;
	let idParam = req.params.id;

	if ( idBody == undefined ){

		res.statusMessage = "MISSING ID TO UPDATE";
		return res.status( 406 ).send();
	}

	if (idBody != idParam){

		res.statusMessage = "THE ID IN THE PARAMETERS DOES NOT MATCH THE BODY ID";
		return res.status( 409 ).send();
	}
	
	let result = bookmList.find((element) =>{

				if (idBody == element.id){

					console.log("HIZO MATCH EL CAMBIO CON LO QUE EXSTE");
					

					if (req.body.title != undefined){


						element.title =req.body.title;
					}

					if (req.body.description != undefined){

						element.description =req.body.description;
					}

					if (req.body.url != undefined){


						element.url =req.body.url;
					}

					if (req.body.rating != undefined){

						element.rating =req.body.rating;
					}

					console.log(element);
					return res.status(202).json(element);
				}
				

				
		});

	
});


app.listen(8080, () => {

	console.log("This server is running in port 8080.");
});


