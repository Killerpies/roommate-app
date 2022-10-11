const express = require("express");
const pool = require("../../../db");
const router = express.Router()


router.post("/", async(req,res)=>{
    try{
      //await
      let { name } = req.body;
      // console.log('req body here')
      // console.log(req.body)
      const newCat = await pool.query(`INSERT INTO cat (name) VALUES ('${name}') RETURNING *`);
      res.json(newCat);
    }catch (error) {
      console.error(error.message);
    }
  });
  
  router.get("/", async (req, res) => {
    try {
      const allTodos = await pool.query("SELECT * FROM cat");
  
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });


  module.exports = router