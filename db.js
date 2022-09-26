require('dotenv').config()

const devConfig = {
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
  database: "roommateapp"
	// database: process.env.PG_DATABASE
};

const proConfig = {
	connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}
const Pool = require("pg").Pool;
const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);

module.exports = pool;


// Connection to the database
// const { Client } = require('pg');
// const client = new Client(process.env.NODE_ENV === "production" ? proConfig : devConfig);
// client.connect();
// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });