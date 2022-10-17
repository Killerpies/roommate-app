const express = require("express");
const pool = require("../../../db");
const router = express.Router()

router.param('transactionid', function(req, res, next, transactionid) {
  const modified = transactionid.toUpperCase();

  req.transactionid = modified;
  next();
});
router.post("/changeDebt", async (req, res) => {
  try {
      // let thisisTrue = true
    let debtID = req.body.debtID
    // let  userID = req.body.userID
    let  amountowed = req.body.amountowed
    let  amountpayed = req.body.amountpayed
    let  activetransaction = req.body.activetransaction
    let command = `UPDATE userDebt SET amountowed = '${amountowed}', amountpayed = '${amountpayed}', activetransaction = '${activetransaction}' WHERE userdebt.deptid = ${debtID}`
    const allTodos = await pool.query(command);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// GET debt  RELATED TO transactionid
router.get("/:transactionid", async (req, res) => {
  try {
      let thisisTrue = true
    const allTodos = await pool.query(`SELECT * FROM userDebt WHERE userid = '${req.transactionid}' AND activetransaction = '${thisisTrue}'`);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});



  module.exports = router