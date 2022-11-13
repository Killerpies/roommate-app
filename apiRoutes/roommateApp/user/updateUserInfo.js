const express = require("express");
const pool = require("../../../db");
const router = express.Router();

// USER ID PARAMETER
router.param("userid", function (req, res, next, userid) {
  const modified = userid.toUpperCase();

  req.userid = modified;
  next();
});
router.get("/api/userInfo", async (req, res) => {
  try {
    const allTodos = await pool.query(
      `SELECT * FROM userInfo WHERE userid = '${req.userid}'`
    );

    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/update/firstName/:userid", async (req, res) => {
  try {
    let userID = req.userid;
    let firstName = req.body.firstName;
    let command = `UPDATE userInfo SET firstName = '${firstName}' WHERE userInfo.userID = '${userID}'`;
    const allTodos = await pool.query(command);
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/update/lastName/:userid", async (req, res) => {
  try {
    let userID = req.userid;
    let lastName = req.body.lastName;
    let command = `UPDATE userInfo SET lastName = '${lastName}' WHERE userInfo.userID = '${userID}'`;
    const allTodos = await pool.query(command);
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/update/email/:userid", async (req, res) => {
  try {
    let userID = req.userid;
    let email = req.body.email;
    let command = `UPDATE userInfo SET email = '${email}' WHERE userInfo.userID = '${userID}'`;
    const allTodos = await pool.query(command);
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/update/phoneNumber/:userid", async (req, res) => {
  try {
    console.log(req.body);
    let userID = req.userid;
    let phoneNumber = req.body.phoneNumber;
    let command = `UPDATE userInfo SET phoneNumber = '${phoneNumber}' WHERE userInfo.userID = '${userID}'`;
    const allTodos = await pool.query(command);
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
