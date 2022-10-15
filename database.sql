DELETE FROM groups  WHERE groupName = 'undefined';
-- CREATE TABLE cat (
--     name varchar(255)
-- );
DROP TABLE IF EXISTS userGroups;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS groupTransactions;
DROP TABLE IF EXISTS userInfo;


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
    transactionDescription varchar(255),
    transactionAmount decimal,
    purchaseDate DATE
);
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