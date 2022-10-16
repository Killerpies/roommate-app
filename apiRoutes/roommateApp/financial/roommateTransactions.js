const express = require("express");
const pool = require("../../../db");
const router = express.Router()


// CREATE A TRANSACTION
router.post("/create", async(req,res)=>{
  try{
    console.log(req.body)
    let groupID = req.body.groupID
    let userID = req.body.userID
    let transactionName = req.body.transactionName
    let transactionDescription = req.body.transactionDescription
    let transactionAmount = req.body.transactionAmount
    let transactionDate = req.body.transactionDate
    // groupID INT REFERENCES groups(groupID),
    // userID varchar(255),
    // transactionName varchar(255),
    // transactionDescription varchar(255),
    // transactionAmount decimal,
    // purchaseDate DATE
    // INSERT INTO groupTransactions
    // (groupID, userID, transactionName, transactionDescription, transactionAmount, purchaseDate)
    // VALUES (1, '101610594509084827079', 'Walmart', 'Bought donuts', 100.50, '2017-03-14')
    const newGroup = await pool.query(`INSERT INTO groupTransactions(groupID, userID, transactionName, transactionDescription, transactionAmount, purchaseDate) VALUES ('${groupID}', '${userID}', '${transactionName}', '${transactionDescription}', '${transactionAmount}', '${transactionDate}') RETURNING transactionid`)
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
      // console.log(req.name)
    const allTodos = await pool.query(`SELECT * FROM groupTransactions WHERE groupid = '${req.groupid}'`);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});
// get all
router.get("/", async (req, res) => {
  try {
    const allTodos = await pool.query(`SELECT * FROM groupTransactions`);

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});


  module.exports = router