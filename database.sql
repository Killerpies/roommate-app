DELETE FROM groups  WHERE groupName = 'undefined';
-- CREATE TABLE cat (
--     name varchar(255)
-- );

CREATE TABLE groups (groupID SERIAL PRIMARY KEY, groupName varchar(255), groupOwnerUserID varchar(255));

CREATE TABLE userGroups(userGroupID SERIAL PRIMARY KEY, userID varchar(255), groupID INT REFERENCES groups(groupID));


INSERT INTO groups(groupName, groupOwnerUserID) VALUES ('firstGroup', '101610594509084827079');

INSERT INTO userGroups(userID, groupID) VALUES ('101610594509084827079', 1);