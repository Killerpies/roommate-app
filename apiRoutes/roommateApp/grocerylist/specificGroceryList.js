const express = require("express");
const pool = require("../../../db");
const router = express.Router()



// GROUP ID PARAMETER
router.param('groceryListID', function(req, res, next, groceryListID) {
  const modified = groceryListID.toUpperCase();

  req.groceryListID = modified;
  next();
});
// GET GROUPS RELATED TO Group
// /api/groups/1
router.post("/:groceryListID", async (req, res) => {
  try {
    let groceryListID = req.groceryListID
    let listContents = req.body.listContents
    let archived = req.body.archived
    let command = `UPDATE groceryLists SET listContents = '${listContents}', archived = '${archived}' WHERE groceryLists.groceryListID = ${groceryListID}`
    const allTodos = await pool.query(command);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});


  module.exports = router