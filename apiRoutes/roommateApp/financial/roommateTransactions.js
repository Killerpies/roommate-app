const express = require("express");
const pool = require("../../../db");
const router = express.Router()


// CREATE A TRANSACTION
router.post("/create", async(req,res)=>{
  try{
    // let firstName = req.body.groupOwnerUserFirstName;
    // let userID = req.body.groupOwnerUserID
    // let lastName = req.body.groupOwnerUserLastName;
    // let defaultSetting = true;
    // INSERT INTO groupTransactions
    // (groupID, userID, transactionName, transactionDescription, transactionAmount, purchaseDate)
    // VALUES (1, '101610594509084827079', 'Walmart', 'Bought donuts', 100.50, '2017-03-14')
    const newGroup = await pool.query(`INSERT INTO groupTransactions(groupID, userID, transactionName, transactionDescription, transactionAmount, purchaseDate) VALUES ('${req.body.groupName}', '${req.body.groupOwnerUserID}', '${req.body.groupOwnerUserFirstName}', '${req.body.groupOwnerUserLastName}') RETURNING groupid`)
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