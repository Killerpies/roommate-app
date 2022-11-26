const express = require("express");
const pool = require("../../../db");
const router = express.Router();

// GET GROUPS RELATED TO Group
// /api/groups/1
router.post("/changeGroupName", async (req, res) => {
  try {
    let groupName = req.body.groupName;
    let groupID = req.body.groupID;
    let command = `UPDATE groups SET groupName = '${groupName}' WHERE groups.groupID = ${groupID}`;
    const allTodos = await pool.query(command);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// /api/groups/1
router.post("/deleteGroup", async (req, res) => {
  try {
    console.log("HERE");
    let groupID = req.body.groupID;
    let command = `DELETE FROM groups WHERE groups.groupID = ${groupID}`;
    const allTodos = await pool.query(command);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
