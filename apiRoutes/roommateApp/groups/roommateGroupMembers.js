const express = require("express");
const pool = require("../../../db");
const router = express.Router()


 // USER ID PARAMETER
 router.param('groupid', function(req, res, next, groupid) {
    const modified = groupid.toUpperCase();
  
    req.groupid = modified;
    next();
  });
  // GET GROUPS RELATED TO USER
  // /api/userGroups/101610594509084827079
  router.get("/:groupid", async (req, res) => {
    try {
        // console.log(req.groupid)
      const allTodos = await pool.query(`SELECT * FROM usergroups WHERE groupID = ${req.groupid}`);
  
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });


module.exports = router