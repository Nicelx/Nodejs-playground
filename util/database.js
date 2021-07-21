const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "..", "data", "password.json");
let password;

const mysql = require("mysql2");

	const pool = mysql.createPool({
		host: "localhost",
		user: "root",
		database: "node-complete",
		// password: password,
		password: '12345'
	});

module.exports = pool.promise();
