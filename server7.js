
const express = require('express');
let bodyParser = require( 'body-parser' );
let jsonParser = bodyParser.json();
let morgan = require('morgan');
let uuid = require( 'uuid' );

let mongoose = require( 'mongoose' );

let { bookmarkList } = require( './model' );
let {DATABASE_URL, PORT} = require( './config' );


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

//THIS IS NOT NEEDED FOR THE DATABASE

let bookmList = [

	{
		id : "PRUEBA",
		title : "SITE NAME",
		description: "WEBSITE",
		url : "https://www.prueba.com/",
		rating : 10
	}
];

// GET THE ALL BOOKMARKS 

app.get('/api/bookmarks',(req,res) =>{

	 bookmarkList.getAll()
        .then( bookmarkList => {
            return res.status( 200 ).json(bookmarkList);
        })

        .catch( error => {
            console.log(error);
            res.statusMessage = "ERROR CONNECTING WITH DATA BASE"
            return res.status( 500 ).send();
        });
	
});


//GET A BOOKMARK BY TITLE IN THE QUERY

app.get('/api/bookmark',(req,res) =>{


	let title = req.query.title;

	if ( title === undefined){

		res.statusMessage = "Missing the bookmark TITLE"
		return res.status( 406 ).end();
	}

	let findTitle = { title : title};

	let result = bookmarkList.findOne( findTitle )
        .then( bookmarkList => {

        		if(bookmarkList == null){

        			res.statusMessage = "The title does not exists"
					return res.status( 404 ).end();
        		}else {

        			return res.status( 200 ).json(bookmarkList);
        		}

            
        })

        .catch( error => {
            console.log(error);
            res.statusMessage = "ERROR CONNECTING WITH DATA BASE"
            return res.status( 500 ).send();
        });

	

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

	bookmarkList.create( newBM )
        		.then( bookmarkList => {
            	return res.status( 200 ).json( bookmarkList );
        	})
        		.catch( error => {
            	console.log(error);
            	res.statusMessage = "ERROR CONNECTING WITH DATA BASE"
            	return res.status( 500 ).send();
        	});

		
});

//DELETE A BOOKMARK


app.delete('/api/bookmark',(req,res) =>{

	
	let idDelete = req.query.id;

	let objRemove = { id : idDelete };

	if ( idDelete === undefined){

		res.statusMessage = "Missing the bookmark ID"
		return res.status( 406 ).end();
	}

	//WE USE THIS METHOD TO VERIFY IF THE ID EXIST

	let result = bookmarkList.findOne( objRemove )
        .then( bookmarkList => {

        		if(bookmarkList == null){

        			res.statusMessage = "The ID does not exists"
					return res.status( 404 ).end();
        		}else {

        		//IF IT EXIST WE USE THE METHOD REMOVE

        			bookmarkList.remove(objRemove) 
    				.then( bookmarkList => {

    			console.log(bookmarkList);
           		return res.status( 201 ).json( bookmarkList );
    	 		})
        		.catch( error => {
           			 res.statusMessage = "ERROR CONNECTING WITH DATA BASE";
           			 return res.status( 500 ).json( error );
     			});

        		}

            
        })

        .catch( error => {
            console.log(error);
            res.statusMessage = "ERROR CONNECTING WITH DATA BASE"
            return res.status( 500 ).send();
        });

	
});

//PATCH TO UPDATE AN ELEMENT FINDING BY THE ID 

app.patch('/api/bookmark/',jsonParser,(req,res) =>{

	
	let idBody = req.body.id;
	let idParam = req.query.id;

	if ( idBody == undefined ){

		res.statusMessage = "MISSING ID TO UPDATE";
		return res.status( 406 ).send();
	}

	if (idBody != idParam){

		
		res.statusMessage = "THE ID IN THE PARAMETERS DOES NOT MATCH THE BODY ID";
		return res.status( 409 ).send();
	}
	
	let bookmarkNew = req.body;
	let idOld = { id : idParam };

	bookmarkList.update(idOld, bookmarkNew)
	.then(bookmarkList =>{
		return res.status( 201 ).json( bookmarkNew );
	})
	.catch( error => {
        res.statusMessage = "ERROR CONNECTING WITH DATA BASE";
        return res.status( 500 ).json( error );
    });
	

	
});


let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}
runServer( PORT, DATABASE_URL );

module.exports = { app, runServer, closeServer }
