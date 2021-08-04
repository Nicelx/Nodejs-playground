const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
	MongoClient.connect(
		"mongodb+srv://Nicel:12345@node-complete.nsiof.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
	)
		.then((client) => {
			console.log("Connected!");
			callback(client);
		})
		.catch((e) => console.log(e));
};

module.exports = mongoConnect;