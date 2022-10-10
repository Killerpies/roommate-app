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
//Financial rout
const roommateFinancial = require("./apiRoutes/roommateFinancial")
app.use("/api/cats" ,roommateFinancial)
// Group Routes
const roommateGroups = require("./apiRoutes/roommateGroups.js")
app.use("/api/groups" ,roommateGroups)
// USER Group Routes
const roommateUserGroups = require("./apiRoutes/roommateUserGroups.js")
app.use("/api/userGroups" ,roommateUserGroups)
// GROUP MEMBER ROUTES
const roommateGroupMember = require("./apiRoutes/roommateGroups.js")
app.use("/api/userGroupMembers" ,roommateGroupMember)


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
