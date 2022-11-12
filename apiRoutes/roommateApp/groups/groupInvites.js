const express = require("express");
const pool = require("../../../db");
const router = express.Router();

// USER ID PARAMETER
router.param("id", function (req, res, next, id) {
  const modified = id.toUpperCase();

  req.id = modified;
  next();
});

// Join A GROUP
router.post("/createInvite/:id", async (req, res) => {
  try {
    let groupID = req.id;
    let activeInvite = true;
    const newInvite = await pool.query(
      `INSERT INTO groupInvites (groupID, activeInvite)
      VALUES ('${groupID}', '${activeInvite}') returning inviteID;`
    );
    res.json(newInvite);
  } catch (error) {
    console.error(error.message);
  }
});

router.post("/resolveInvite/:id", async (req, res) => {
  try {
    // console.
    let activeInvite = false;
    let inviteID = req.id;
    let command = `UPDATE groupInvites SET activeInvite = '${activeInvite}' WHERE groupInvites.inviteID = ${inviteID}`;
    const newInvite = await pool.query(command);
    res.json(newInvite);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/findInvite/:id", async (req, res) => {
  try {
    let inviteID = req.id;
    const allTodos = await pool.query(
      `SELECT * FROM groupInvites WHERE inviteID = ${inviteID}`
    );

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
