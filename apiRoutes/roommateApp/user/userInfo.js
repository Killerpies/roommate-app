const express = require("express");
const pool = require("../../../db");
const router = express.Router()



// ADD USER INFO TO TABLE IF DOES NOT ALREADY EXIST
//INSERT INTO userInfo
// (userID, firstName, lastName, phoneNumber, email)
router.post("/create", async(req,res)=>{
    try{
      const newGroup = await pool.query(`INSERT INTO userInfo (userID, firstName, lastName) VALUES ('${req.body.userID}', '${req.body.firstName}', '${req.body.lastName}') ON CONFLICT (userID) DO NOTHING`)
      res.json(newGroup)

    }catch (error) {
      console.error(error.message);
    }
  });

  
  // USER ID PARAMETER
  router.param('userid', function(req, res, next, userid) {
    const modified = userid.toUpperCase();
  
    req.userid = modified;
    next();
  });
  router.get("/:userid", async (req, res) => {
    try {
      const allTodos = await pool.query(`SELECT * FROM userInfo WHERE userid = '${req.userid}'`);
  
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
  
// get all
  router.get("/", async (req, res) => {
    try {
      const allTodos = await pool.query(`SELECT * FROM userInfo`);
  
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });



  router.post("/:userid", async (req, res) => {
    try {
      const allTodos = await pool.query(`SELECT * FROM userInfo WHERE userid = '${req.userid}'`);
  
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });





module.exports = router