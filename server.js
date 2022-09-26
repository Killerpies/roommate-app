if (!process.env.NODE_ENV){
	require('dotenv').config()
}

const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const port = process.env.PORT || 8080;


const devConfig = {
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	database: process.env.PG_DATABASE
};

const proConfig = {
	connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}
// Connection to the database
const { Client } = require('pg');
const client = new Client(process.env.NODE_ENV === "production" ? proConfig : devConfig);
client.connect();
client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

// //
const app = express();

//here we are configuring dist to serve app files
app.use("/", serveStatic(path.join(__dirname, "/dist")));

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

app.listen(port);
console.log(`app is listening on port: ${port}`);
// const express = require('express')
// const serveStatic = require('serve-static')
// const path = require('path')

// const app = express()

// //here we are configuring dist to serve app files
// app.use('/', serveStatic(path.join(__dirname, '/dist')))

// // this * route is to serve project on different page routes except root `/`
// app.get(/.*/, function (req, res) {
// 	res.sendFile(path.join(__dirname, '/dist/index.html'))
// })

// const port = process.env.PORT || 8080
// app.listen(port)
// console.log(`app is listening on port: ${port}`)