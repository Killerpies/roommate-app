const express = require("express");
const pool = require("../../../db");
const router = express.Router()




  // Join A GROUP
  router.post("/removeMember", async(req,res)=>{
    try{
      console.log(req.body)
      let userID = req.body.userid
      let groupID = req.body.groupID
      // await pool.query(`UPDATE userGroups SET defaultGroup = false WHERE userID = ${userID} AND defaultGroup = true`)
      //{userID}', ${newGroupID}, '${firstName}', '${lastName}', ${defaultSetting}
      const newUserGroup = await pool.query(`DELETE FROM userGroups WHERE userGroups.userID = '${userID}' AND userGroups.groupID = ${groupID}`)
      res.json(newUserGroup)
    }catch (error) {
      console.error(error.message);
    }
  });



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
      const allTodos = await pool.query(`SELECT * FROM usergroups WHERE groupID = ${req.groupid}`);
  
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });


module.exports = router