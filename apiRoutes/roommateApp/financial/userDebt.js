const express = require("express");
const pool = require("../../../db");
const router = express.Router()


// CREATE A Debt entry
router.post("/create", async(req,res)=>{
  try{
    let userID = req.body.userID
    let groupID = req.body.groupID
    let transactionID= req.body.transactionID
    let percentOwed = req.body.percentOwed
    let amountOwed = req.body.amountOwed
    let userOwedID = req.body.userOwedID
    let activeTransaction = req.body.activeTransaction
    const newGroup = await pool.query(
        `INSERT INTO userDebt
        (userID, groupID, transactionID, percentOwed, amountOwed, userOwedID, activeTransaction) 
        VALUES ('${userID}', '${groupID}', '${transactionID}', '${percentOwed}', '${amountOwed}', '${userOwedID}', '${activeTransaction}') RETURNING transactionid`)
    res.json(newGroup)
  }catch (error) {
    console.error(error.message);
  }
});

// transactionid ID PARAMETER
router.param('transactionid', function(req, res, next, transactionid) {
  const modified = transactionid.toUpperCase();

  req.transactionid = modified;
  next();
});
// GET debt  RELATED TO transactionid
router.get("/:transactionid", async (req, res) => {
  try {
      let thisisTrue = true
    const allTodos = await pool.query(`SELECT * FROM userDebt WHERE transactionid = '${req.transactionid}' AND activetransaction = '${thisisTrue}'`);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});
// get all
router.get("/", async (req, res) => {
  try {
    const allTodos = await pool.query(`SELECT * FROM userDebt`);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});


  module.exports = router