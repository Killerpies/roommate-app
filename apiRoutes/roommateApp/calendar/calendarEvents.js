const express = require("express");
const pool = require("../../../db");
const router = express.Router()


// CREATE A List
router.post("/create", async(req,res)=>{
  try{
    let groupID = req.body.groupID
    let title = req.body.title
    let eventDateStart = req.body.eventDateStart
    let eventDateEnd = req.body.eventDateEnd
    const newGroup = await pool.query(`INSERT INTO calendarEvents(groupID, title, eventDateStart, eventDateEnd) VALUES ('${groupID}', '${title}', '${eventDateStart}', '${eventDateEnd}') RETURNING eventID`)
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
    const allTodos = await pool.query(`SELECT * FROM calendarEvents WHERE groupid = '${req.groupid}'`);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});
// get all
router.get("/", async (req, res) => {
  try {
    const allTodos = await pool.query(`SELECT * FROM calendarEvents`);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});


  module.exports = router