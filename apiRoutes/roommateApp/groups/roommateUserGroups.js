const express = require("express");
const pool = require("../../../db");
const router = express.Router()

  // USER ID PARAMETER
  router.param('userid', function(req, res, next, userid) {
    const modified = userid.toUpperCase();
  
    req.userid = modified;
    next();
  });
  // GET GROUPS RELATED TO USER
  // /api/userGroups/101610594509084827079
  router.get("/:userid", async (req, res) => {
    try {
        // console.log(`here`)
      const allTodos = await pool.query(`SELECT * FROM userGroups WHERE userid = '${req.userid}'`);
  
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });

  
// get all
  router.get("/", async (req, res) => {
    try {
      const allTodos = await pool.query(`SELECT * FROM userGroups`);
  
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });




module.exports = router