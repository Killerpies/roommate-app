if (!process.env.NODE_ENV){
	require('dotenv').config()
}
const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const port = process.env.PORT || 8080;
// const pool = require("./db");
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// routes
//Group transactions route
const roommateTransactions = require("./apiRoutes/roommateApp/financial/roommateTransactions")
app.use("/api/groupTransaction" ,roommateTransactions)
//Specific transactions route
const transaction = require("./apiRoutes/roommateApp/financial/transactions.js")
app.use("/api/transaction" ,transaction)
// User Debt Routes
const userdebt = require("./apiRoutes/roommateApp/financial/userDebt.js")
app.use("/api/userDebt" ,userdebt)
// Group Routes
const roommateGroups = require("./apiRoutes/roommateApp/groups/roommateGroups.js")
app.use("/api/groups" ,roommateGroups)
// USER Group Routes
const roommateUserGroups = require("./apiRoutes/roommateApp/groups/roommateUserGroups.js")
app.use("/api/userGroups" ,roommateUserGroups)
// GROUP MEMBER ROUTES
const roommateGroupMember = require("./apiRoutes/roommateApp/groups/roommateGroupMembers.js")
app.use("/api/userGroupMembers" ,roommateGroupMember)
// USER INFO ROUTES
const userInfo = require("./apiRoutes/roommateApp/user/userInfo.js")
app.use("/api/userInfo", userInfo)

//here we are configuring dist to serve app files
if (process.env.NODE_ENV === "production"){
  app.use("/", serveStatic(path.join(__dirname, "/dist")));
}


// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});



app.listen(port);
console.log(`app is listening on port: ${port}`);
