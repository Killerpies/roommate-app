if (!process.env.NODE_ENV){
	require('dotenv').config()
}
const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const port = process.env.PORT || 8080;
const pool = require("./db");
const app = express();
app.use(express.json());


app.post("/cats", async(req,res)=>{
  try{
    //await
    let { name } = req.body;
    console.log('req body here')
    console.log(req.body)
    const newCat = await pool.query(`INSERT INTO cat (name) VALUES ('${name}') RETURNING *`);
    res.json(newCat);
  }catch (error) {
    console.error(error.message);
  }
});

app.get("/cats", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM cat");

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//here we are configuring dist to serve app files
app.use("/", serveStatic(path.join(__dirname, "/dist")));

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});



app.listen(port);
console.log(`app is listening on port: ${port}`);
