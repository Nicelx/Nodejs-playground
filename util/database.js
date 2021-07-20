const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "..", "data", "password.json");
let password;

// TO DO move password to .env file 
fs.readFile(p, (err, data) => {
	password = JSON.parse(data);
});
console.log(password);
const mysql = require("mysql2");

	const pool = mysql.createPool({
		host: "localhost",
		user: "root",
		database: "node-complete",
		// password: password,
		password: 'password'
	});

module.exports = pool.promise();
