DELETE FROM groups  WHERE groupName = 'undefined';
-- CREATE TABLE cat (
--     name varchar(255)
-- );

DROP TABLE IF EXISTS userGroups;
DROP TABLE IF EXISTS groups;


CREATE TABLE groups (groupID SERIAL PRIMARY KEY, groupName varchar(255), groupOwnerUserID varchar(255), groupOwnerUserFirstName varchar(255), groupOwnerUserLastName varchar(255));

CREATE TABLE userGroups(userGroupID SERIAL PRIMARY KEY, userID varchar(255), groupID INT REFERENCES groups(groupID), userFirstName varchar(255), userLastName varchar(255), defaultGroup boolean);

INSERT INTO groups(groupName, groupOwnerUserID, groupOwnerUserFirstName, groupOwnerUserLastName) VALUES ('firstGroup', '101610594509084827079', 'Justin', 'Sanders');

INSERT INTO userGroups(userID, groupID, userFirstName, userLastName, defaultGroup) VALUES ('101610594509084827079', 1, 'Justin', 'Sanders', True);


UPDATE TABLE userGroups SET defaultGroup = False WHERE defaultGroup = True;