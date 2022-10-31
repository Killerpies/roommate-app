const express = require("express");
const pool = require("../../../db");
const router = express.Router()


// CREATE A List
/**
 * INSERT INTO groceryLists (groupID, listName, listContents, activeList)
    VALUES (1, 'templist', '[{"itemName": 1, "activeItem": false},{"itemName": "hello", "activeItem": false}]', False);
 */
router.post("/create", async(req,res)=>{
  try{
    let groupID = req.body.groupID
    let listName = req.body.listName
    let listContents = req.body.listContents
    let activeList = req.body.activeList
    const newGroup = await pool.query(`INSERT INTO chorelists(groupID, listName, listContents, activeList) VALUES ('${groupID}', '${listName}', '${listContents}', '${activeList}') RETURNING choreListID`)
    res.json(newGroup)
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
    const allTodos = await pool.query(`SELECT * FROM chorelists WHERE groupid = '${req.groupid}'`);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});
// get all
router.get("/", async (req, res) => {
  try {
    const allTodos = await pool.query(`SELECT * FROM chorelists`);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});


  module.exports = router