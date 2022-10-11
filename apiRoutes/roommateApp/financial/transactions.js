const express = require("express");
const pool = require("../../../db");
const router = express.Router()
// GROUP ID PARAMETER
router.param('transactionid', function(req, res, next, transactionid) {
  const modified = transactionid.toUpperCase();

  req.transactionid = modified;
  next();
});
// GET GROUPS RELATED TO Group
// /api/groups/1
router.get("/:transactionid", async (req, res) => {
  try {
      // console.log(req.name)
    const allTodos = await pool.query(`SELECT * FROM groupTransactions WHERE transactionID = '${req.transactionid}'`);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});



  module.exports = router