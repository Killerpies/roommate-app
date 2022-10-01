const express = require("express");
const pool = require("../db");
const router = express.Router()


// CREATE A GROUP
router.post("/create", async(req,res)=>{
    try{
      // CREATE THE GROUP
      const newGroup = await pool.query(`INSERT INTO groups(groupName, groupOwnerUserID) VALUES ('${req.body.groupName}', '${req.body.groupOwnerUserID}') RETURNING groupid`)
      res.json(newGroup)
      // GET NEW GROUPID
      let newGroupID = newGroup.rows[0].groupid
      // CREATE USER GROUP THATS ASSOCIATED
      // INSERT INTO userGroups(userID, groupID) VALUES ('101610594509084827079', 1);
      const newUserGroup = await pool.query(`INSERT INTO userGroups(userID, groupID) VALUES ('${req.body.groupOwnerUserID}', ${newGroupID})`)
      res.json(newUserGroup)
    }catch (error) {
      console.error(error.message);
    }
  });
  
  // GROUP ID PARAMETER
  router.param('groupid', function(req, res, next, groupid) {
    const modified = groupid.toUpperCase();
  
    req.groupid = modified;
    next();
  });
  // GET GROUPS RELATED TO Group
  // /api/groups/1
  router.get("/:groupid", async (req, res) => {
    try {
        console.log(req.name)
      const allTodos = await pool.query(`SELECT * FROM groups WHERE groupID = '${req.groupid}'`);
  
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
// get all
  router.get("/", async (req, res) => {
    try {
      const allTodos = await pool.query(`SELECT * FROM groups`);
  
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
 



module.exports = router