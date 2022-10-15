import axios from "axios";


export default {
    async  getGroupMembers(groupID) {
        // gets groupID, groupname, groupowner
        let url = `/api/groups/${groupID}`;
        let result = await axios.get(url);
        let groupInfo = result.data[0];
        console.log(groupInfo)
        return groupInfo
    },

    async  getGroupInfo(groupID) {
        // gets members of the group
        let groupUsers = []
        let url = `/api/userGroupMembers/${groupID}`;
        let response = await axios.get(url);
        for (let i = 0; i < response.data.length; i++) {
            let tempUser = {
            userid: response.data[i].userid,
            firstName: response.data[i].userfirstname,
            lastName: response.data[i].userlastname,
            };
            groupUsers.push(tempUser);
        }
        console.log(groupUsers)
        return groupUsers
        }
}
