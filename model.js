
let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let uuid = require("uuid");

let idN = uuid.v4();

let bookmarkCollection = mongoose.Schema({ 

	id : { type : String, data : idN },

	title : { type: String },

	description : { type: String},

	url : { type: String },

	rating : { type: Number }

});

let Bookmark = mongoose.model('bookmarks',bookmarkCollection); //'bookmarks' --> IS THE NAME OF THE TABLE/COLLECTION

let bookmarkList = {

	getAll : function(){

		return Bookmark.find()
		.then( bookmarks =>{
			return bookmarks;
		})

		.catch(error => {
			throw Error( error );
		});
	},
	findOne : function( title ){

	
	return Bookmark.findOne(title)
		.then( bookmarks =>{
			return bookmarks;
		})

		.catch(error => {
			throw Error( error );
		});
	},
	create : function( newBookmark ){

		return Bookmark.create( newBookmark )
				.then( bookmarks => {
					return bookmarks;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	remove : function( removeBookmark ){

        return Bookmark.remove(removeBookmark)
            then( bookmarks => {
                return bookmarks;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    update : function (idOld, bookmarkNew){
        return Bookmark.updateOne(idOld, bookmarkNew)
            then( bookmarks => {
                return bookmarks;
            })
            .catch( error => {
                throw Error( error );
            });
    }
};

module.exports = {

	bookmarkList
};