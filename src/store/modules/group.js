// import userServices from "../../services/roommateApp/user/userServices"
import axios from "axios";
export default {
  state: {
    groupInfo: null,
    groupUsers: [],
    groupContactInfo: [],
    groupName: "",
    groupID: "",
    currentTab: "financial",
  },
  getters: {
    groupname: function (state) {
      return state.groupName;
    },
    groupUsers: function (state) {
      return state.groupUsers;
    },
    groupInfo: function (state) {
      return state.groupInfo;
    },
    groupContactInfo: function (state) {
      return state.groupContactInfo;
    },
    groupID: function (state) {
      return state.groupID;
    },
    currentTab: function (state) {
      return state.currentTab;
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
    UPDATE_GROUP_CONTACT_INFO(state, payload) {
      state.groupContactInfo = payload;
    },
    SET_GROUP_NAME(state, groupName) {
      state.groupName = groupName;
    },
    SET_GROUP_ID(state, groupID) {
      state.groupID = groupID;
    },
    SET_CURRENT_TAB(state, currentTab) {
      state.currentTab = currentTab;
    },
  },
  actions: {
    inviteMemberWithEmail: async function (context, payload) {
      let url = `/api/send-email`;
      await axios.post(url, payload);
    },
    createGroupInvite: async function (context, groupID) {
      let url = `/api/groupInvites/createInvite/${groupID}`;
      let response = await axios.post(url);
      return response.data.rows[0].inviteid;
    },
    resolveGroupInvite: async function (context, inviteID) {
      let url = `/api/groupInvites/resolveInvite/${inviteID}`;
      await axios.post(url);
    },
    changeCurrentTab: function (context, currentTab) {
      context.commit("SET_CURRENT_TAB", currentTab);
    },
    getGroupContactInfo: async function (context, groupUsers) {
      let tempGroupContactInfo = [];
      for (let i = 0; i < groupUsers.length; i++) {
        let url = `/api/userInfo/${groupUsers[i].userid}`;
        let response = await axios.get(url);
        // console.log(response.data);
        let temp = response.data[0];
        tempGroupContactInfo.push(temp);
      }
      context.commit("UPDATE_GROUP_CONTACT_INFO", tempGroupContactInfo);
      return tempGroupContactInfo;
    },
    removeUserFromGroup: async function (context, payload) {
      let url = `/api/userGroupMembers/removeMember`;
      // console.log(payload);
      await axios.post(url, payload);
      context.commit("UPDATE_GROUPMEMBERS", payload.groupUsers);
    },
    changeGroupName: async function (context, payload) {
      let url = `/api/alterGroup/changeGroupName`;
      await axios.post(url, payload);
      context.commit("SET_GROUP_NAME", payload.groupName);
    },
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
      // console.log(response.data);
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
    /**
     * Takes the current userID
     * Finds groups associated with that ID
     * For each group Then get the groupNames associated with them and add to list of objects
     */
    getRelatedGroups: async function (context, userID) {
      let url = `/api/usergroups/${userID}`;
      let data = await axios.get(url);
      let groups = data.data;

      let tempGroups = [];
      for (let i = 0; i < groups.length; i++) {
        let url = `/api/groups/${groups[i].groupid}`;
        let data = await axios.get(url);
        if (data.data[0]) {
          tempGroups.push(data.data[0]);
        }
      }
      return tempGroups;
    },
  },
};
