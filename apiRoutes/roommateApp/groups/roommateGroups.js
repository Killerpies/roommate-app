const express = require("express");
const pool = require("../../../db");
const router = express.Router()


// CREATE A GROUP
router.post("/create", async(req,res)=>{
    try{
      // INSERT INTO groups(groupName, groupOwnerUserID, groupOwnerUserFirstName, groupOwnerUserLastName) VALUES ('firstGroup', '101610594509084827079', 'Justin', 'Sanders');
      // CREATE THE GROUP
      let firstName = req.body.groupOwnerUserFirstName;
      let userID = req.body.groupOwnerUserID
      // console.log(firstName)
      let lastName = req.body.groupOwnerUserLastName;
      let defaultSetting = true;
      const newGroup = await pool.query(`INSERT INTO groups(groupName, groupOwnerUserID, groupOwnerUserFirstName, groupOwnerUserLastName) VALUES ('${req.body.groupName}', '${req.body.groupOwnerUserID}', '${req.body.groupOwnerUserFirstName}', '${req.body.groupOwnerUserLastName}') RETURNING groupid`)
      res.json(newGroup)
      // GET NEW GROUPID
      let newGroupID = newGroup.rows[0].groupid
      // CREATE USER GROUP THATS ASSOCIATED
      // INSERT INTO userGroups(userID, groupID) VALUES ('101610594509084827079', 1);
      // INSERT INTO userGroups(userID, groupID, userFirstName, userLastName, defaultGroup) VALUES ('101610594509084827079', 1, 'Justin', 'Sanders', True);
      await pool.query(`UPDATE userGroups SET defaultGroup = false WHERE defaultGroup = true`)
      // res.json(editUserGroup)
      const newUserGroup = await pool.query(`INSERT INTO userGroups(userID, groupID, userFirstName, userLastName, defaultGroup) VALUES ('${userID}', ${newGroupID}, '${firstName}', '${lastName}', ${defaultSetting})`)
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
        // console.log(req.name)
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