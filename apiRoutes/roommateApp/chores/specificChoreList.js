const express = require("express");
const pool = require("../../../db");
const router = express.Router()



// GROUP ID PARAMETER
router.param('choreListID', function(req, res, next, choreListID) {
  const modified = choreListID.toUpperCase();

  req.choreListID = modified;
  next();
});
// GET GROUPS RELATED TO Group
// /api/groups/1
router.post("/:choreListID", async (req, res) => {
  try {
    let choreListID = req.choreListID
    let listContents = req.body.listContents
    let archived = req.body.archived
    let command = `UPDATE chorelists SET listContents = '${listContents}', archived = '${archived}' WHERE choreLists.choreListID = ${choreListID}`
    const allTodos = await pool.query(command);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});


  module.exports = router