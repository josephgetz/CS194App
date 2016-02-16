//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

//The collection we want to search
var collections = ["Transactions"]

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://heroku_2n17smsd:je7ho1n1fpt810asuetg55jm0h@ds051913.mongolab.com:51913/heroku_2n17smsd';

var total = 0
var SocialTotal = 0
var KitchenTotal =0

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //We are connected
    console.log('Connection established to', url);
    var collection = db.collection("Transactions");
    collection.find({HouseName: "Grove"}, {SocialExpense:1, KitchenExpense:1}).toArray(function(err, result){
		if(err){
			console.log(err);
		}else if (result.length){
			console.log('Found it:',result);
			for(var i =0; i<result.length; i++){
				total += result[i].SocialExpense + result[i].KitchenExpense
				SocialTotal += result[i].SocialExpense
				KitchenTotal += result[i].KitchenExpense
			}
			console.log('The total is', total);
			console.log('The Social total is', SocialTotal)
			console.log('The Kitchen total is', KitchenTotal)
		}else{
			console.log('None found');
		}
	

    //Close connection
    db.close();
    });
  }
});

var getTotalSpending = function(){return Math.round(total)};
var getTotalSocial = function(){return SocialTotal};
var getTotalKitchen = function(){return KitchenTotal};