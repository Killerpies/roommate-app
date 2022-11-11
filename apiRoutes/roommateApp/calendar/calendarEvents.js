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
    let eventDescription = req.body.eventDescription
    const newGroup = await pool.query(`INSERT INTO calendarEvents(groupID, title, eventDateStart, eventDateEnd, eventDescription) VALUES ('${groupID}', '${title}', '${eventDateStart}', '${eventDateEnd}', '${eventDescription}') RETURNING eventID`)
    res.json(newGroup)
  }catch (error) {
    console.error(error.message);
  }
});
router.post("/updateEvent", async(req,res)=>{
  try{
    let eventID = req.body.eventID
    // let groupID = req.body.groupID
    let title = req.body.title
    let eventDateStart = req.body.eventDateStart
    let eventDateEnd = req.body.eventDateEnd
    let eventDescription = req.body.eventDescription
    console.log(req.body)
    // let command = `UPDATE groups SET groupName = '${groupName}' WHERE groups.groupID = ${groupID}`
    let command = `Update calendarEvents SET title = '${title}',eventDateStart = '${eventDateStart}', eventDateEnd = '${eventDateEnd}', eventDescription = '${eventDescription}' WHERE calendarEvents.eventID = ${eventID} `
    const newGroup = await pool.query(command)
    res.json(newGroup)
  }catch (error) {
    console.error(error.message);
  }
});

// GROUP ID PARAMETER
router.param('id', function(req, res, next, id) {
  const modified = id.toUpperCase();

  req.id = modified;
  next();
});
// GET GROUPS RELATED TO Group
// /api/groups/1
router.get("/eventsforGroup/:id", async (req, res) => {
  try {
    const allTodos = await pool.query(`SELECT * FROM calendarEvents WHERE groupid = '${req.id}'`);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/singleEvent/:id", async (req, res) => {
  try {
    const allTodos = await pool.query(`SELECT * FROM calendarEvents WHERE eventID = '${req.id}'`);

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