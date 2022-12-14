if (!process.env.NODE_ENV) {
  require("dotenv").config();
}
const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const port = process.env.PORT || 8080;
// const pool = require("./db");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

/* Redirect http to https */
app.get("*", function (req, res, next) {
  if (
    "https" !== req.headers["x-forwarded-proto"] &&
    "production" === process.env.NODE_ENV
  ) {
    res.redirect("https://" + req.hostname + req.url);
  } else {
    // Continue to other routes if we're not redirecting
    next();
  }
});

// routes
//Group transactions route
const roommateTransactions = require("./apiRoutes/roommateApp/financial/roommateTransactions");
app.use("/api/groupTransaction", roommateTransactions);
//Specific transactions route
const transaction = require("./apiRoutes/roommateApp/financial/transactions.js");
app.use("/api/transaction", transaction);
// User Debt Routes
const userdebt = require("./apiRoutes/roommateApp/financial/userDebt.js");
app.use("/api/userDebt", userdebt);
// Specific User Debt
const userdebtspecific = require("./apiRoutes/roommateApp/financial/userDebtSpecific.js");
app.use("/api/specificUserDebt", userdebtspecific);
// Group Routes
const roommateGroups = require("./apiRoutes/roommateApp/groups/roommateGroups.js");
app.use("/api/groups", roommateGroups);
// ALTER GROUP ROUTES
const roommateGroupAlter = require("./apiRoutes/roommateApp/groups/alterGroup.js");
app.use("/api/alterGroup", roommateGroupAlter);
// USER Group Routes
const roommateUserGroups = require("./apiRoutes/roommateApp/groups/roommateUserGroups.js");
app.use("/api/userGroups", roommateUserGroups);
// GROUP MEMBER ROUTES
const roommateGroupMember = require("./apiRoutes/roommateApp/groups/roommateGroupMembers.js");
app.use("/api/userGroupMembers", roommateGroupMember);
// USER INFO ROUTES
const userInfo = require("./apiRoutes/roommateApp/user/userInfo.js");
app.use("/api/userInfo", userInfo);
// UPDATE USER INFO
const updateUserInfo = require("./apiRoutes/roommateApp/user/updateUserInfo.js");
app.use("/api/updateUserInfo", updateUserInfo);
// GROCERY LIST ROUTES
const groupGroceryList = require("./apiRoutes/roommateApp/grocerylist/groupGroceryList.js");
app.use("/api/grocerylist", groupGroceryList);
// SPECIFIC GROCERY LIST MODIFICATIONS
const groceryListSpecific = require("./apiRoutes/roommateApp/grocerylist/specificGroceryList.js");
app.use("/api/specificgrocerylist", groceryListSpecific);
// CHORE LIST ROUTES
const groupChoreList = require("./apiRoutes/roommateApp/chores/groupChoreList.js");
app.use("/api/chorelist", groupChoreList);
// SPECIFIC CHORE LIST MODIFICATIONS
const choreListSpecific = require("./apiRoutes/roommateApp/chores/specificChoreList.js");
app.use("/api/specificchorelist", choreListSpecific);
// CALENDAR EVENTS
const calendarEvents = require("./apiRoutes/roommateApp/calendar/calendarEvents.js");
app.use("/api/groupcalendar", calendarEvents);
// SEND EMAIL
const sendEmail = require("./apiRoutes/roommateApp/sendemail/sendEmail.js");
app.use("/api/send-email", sendEmail);
// GROUP INVITES
const groupInvites = require("./apiRoutes/roommateApp/groups/groupInvites");
app.use("/api/groupInvites", groupInvites);

//here we are configuring dist to serve app files
if (process.env.NODE_ENV === "production") {
  app.use("/", serveStatic(path.join(__dirname, "/dist")));
}

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

app.listen(port);
console.log(`app is listening on port: ${port}`);
