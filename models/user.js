const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId

class User {
	constructor(username, email) {
		this.name = username;
		this.email = email;
		// this._id = new mongodb.ObjectId(id);
	}

	save() {
		const db = getDb();
		return db.collection("users").insertOne(this);
	}

	static findById(userId) {
		const db = getDb();
		return db.collection("users").findOne({ _id: new ObjectId(userId) }).then(user => {
			return user
		});
	}
}

module.exports = User;
