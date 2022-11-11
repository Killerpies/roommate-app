// import userServices from "../../services/roommateApp/user/userServices"
import axios from "axios";
export default {
  state: {
    groupInfo: null,
    groupUsers: [],
    groupName: "",
    groupID: "",
  },
  getters: {
    groupname: function (state) {
      return state.groupName;
    },
    groupUsers: function (state) {
      return state.groupUsers;
    },
    groupID: function (state) {
      return state.groupID;
    },
  },
  mutations: {
    UPDATE_GROUP(state, payload) {
      state.groupInfo = payload;
      state.groupName = payload.groupname;
      state.groupID = payload.groupid;
    },
    UPDATE_GROUPMEMBERS(state, payload) {
      state.groupUsers = payload;
    },
    SET_GROUP_NAME(state, firstname) {
      state.firstname = firstname;
    },
    SET_GROUP_ID(state, lastname) {
      state.lastname = lastname;
    },
    SET_USER_ID(state, userID) {
      state.userID = userID;
    },
  },
  actions: {
    /**
     * Makes call to server getting group name from server
     * Then makes another call to server getting all users attached to the group
     */
    getGroupInfo: async function (context, groupID) {
      // gets groupID, groupname, groupowner
      let url = `/api/groups/${groupID}`;
      let result = await axios.get(url);
      let groupInfo = result.data[0];
      context.commit("UPDATE_GROUP", groupInfo);
      return groupInfo;
    },
    getGroupUsers: async function (context, groupID) {
      // gets members of the group
      let url = `/api/userGroupMembers/${groupID}`;
      let response = await axios.get(url);
      let groupUsers = [];
      for (let i = 0; i < response.data.length; i++) {
        let tempUser = {
          userid: response.data[i].userid,
          firstName: response.data[i].userfirstname,
          lastName: response.data[i].userlastname,
        };
        groupUsers.push(tempUser);
      }
      context.commit("UPDATE_GROUPMEMBERS", groupUsers);
      return groupUsers;
    },
  },
};
