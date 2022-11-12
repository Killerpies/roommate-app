DROP TABLE IF EXISTS userDebt;
DROP TABLE IF EXISTS userGroups;
DROP TABLE IF EXISTS groupTransactions;
DROP TABLE IF EXISTS userInfo;
DROP TABLE IF EXISTS groceryLists;
DROP TABLE IF EXISTS choreLists;
DROP TABLE IF EXISTS calendarEvents;
DROP TABLE IF EXISTS groupInvites;
DROP TABLE IF EXISTS groups;

CREATE TABLE groups 
(
    groupID SERIAL PRIMARY KEY,
    groupName varchar(255), 
    groupOwnerUserID varchar(255),
    groupOwnerUserFirstName varchar(255),
    groupOwnerUserLastName varchar(255)
);

CREATE TABLE userGroups
(
    userGroupID SERIAL PRIMARY KEY,
    userID varchar(255),
    groupID INT REFERENCES groups(groupID),
    userFirstName varchar(255),
    userLastName varchar(255),
    defaultGroup boolean
);

CREATE TABLE userInfo
(
    userID varchar(255) PRIMARY KEY,
    firstName varchar(255),
    lastName varchar(255),
    phoneNumber varchar(11),
    email varchar(255)
);

 CREATE TABLE groupTransactions
 (
    transactionID SERIAL PRIMARY KEY,
    groupID INT REFERENCES groups(groupID),
    userID varchar(255),
    transactionName varchar(255),
    transactionDescription text,
    transactionAmount decimal,
    purchaseDate DATE
);

CREATE TABLE userDebt
(
    deptID SERIAL PRIMARY KEY,
    userID varchar(255),
    groupID INT REFERENCES groups(groupID),
    transactionID INT REFERENCES groupTransactions(transactionID),
    percentOwed decimal,
    amountOwed decimal,
    amountPayed decimal,
    userOwedID varchar(255),
    activeTransaction boolean
);

CREATE TABLE groceryLists
(
    groceryListID SERIAL PRIMARY KEY,
    groupID INT REFERENCES groups(groupID),
    listName varchar(255),
    listContents jsonb,
    archived jsonb,
    activeList boolean
);

CREATE TABLE choreLists
(
    choreListID SERIAL PRIMARY KEY,
    groupID INT REFERENCES groups(groupID),
    listName varchar(255),
    listContents jsonb,
    archived jsonb,
    activeList boolean
);

CREATE TABLE calendarEvents
(
    eventID SERIAL PRIMARY KEY,
    groupID INT REFERENCES groups(groupID),
    title varchar(255),
    eventDateStart DATE,
    eventDateEnd DATE,
    eventDescription text
);

CREATE TABLE groupInvites
(
    inviteID SERIAL PRIMARY KEY,
    groupID INT REFERENCES groups(groupID),
    activeInvite boolean
);


-- EXAMPLE INSERTS FOR EACH TABLE

INSERT INTO groupInvites (inviteID, groupID, activeInvite)
    VALUES (1, True);

INSERT INTO groceryLists (groupID, listName, listContents, activeList)
    VALUES (1, 'templist', '[]', False);

INSERT INTO userDebt (userID, groupID, transactionID, percentOwed, amountOwed,amountPayed ,userOwedID, activeTransaction)
    VALUES ('101610594509084827079', 1, 1, .5, 100, 0,'101610594509084827079', True)

INSERT INTO userInfo (userID, firstName, lastName) VALUES ('101610594509084827079', 'Justin', 'Sanders') ON CONFLICT userID DO NOTHING


INSERT INTO groups
    (groupName, groupOwnerUserID, groupOwnerUserFirstName, groupOwnerUserLastName) 
    VALUES ('firstGroup', '101610594509084827079', 'Justin', 'Sanders');

INSERT INTO userGroups
    (userID, groupID, userFirstName, userLastName, defaultGroup) 
    VALUES ('101610594509084827079', 1, 'Justin', 'Sanders', True);

INSERT INTO userInfo
    (userID, firstName, lastName, phoneNumber, email)
    VALUES ('101610594509084827079', Justin, Sanders, '7778889999', 'test@email.com')

INSERT INTO groupTransactions
    (groupID, userID, transactionName, transactionDescription, transactionAmount, purchaseDate)
    VALUES (1, '101610594509084827079', 'Walmart', 'Bought donuts', 100.50, '2017-03-14')

UPDATE TABLE userGroups SET defaultGroup = False WHERE defaultGroup = True;

DELETE FROM groups  WHERE groupName = 'undefined';
-- CREATE TABLE cat (
--     name varchar(255)
-- );