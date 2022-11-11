import axios from "axios";
export default {
  state: {
    userInfo: null,
    firstname: "",
    lastname: "",
    userid: "",
  },
  getters: {
    firstname: function (state) {
      return state.firstname;
    },
    lastname: function (state) {
      return state.lastname;
    },
    userid: function (state) {
      return state.userid;
    },
    userInfo: function (state) {
      return state.userInfo;
    },
  },
  mutations: {
    UPDATE_USER(state, payload) {
      state.userInfo = payload;
      state.firstname = payload.firstname;
      state.lastname = payload.lastname;
      state.userid = payload.userid;
    },
    SET_FIRST_NAME(state, firstname) {
      state.firstname = firstname;
    },
    SET_LAST_NAME(state, lastname) {
      state.lastname = lastname;
    },
    SET_USER_ID(state, userID) {
      state.userID = userID;
    },
  },
  actions: {
    async createUser(context, payload) {
      let url = `/api/userinfo/create`;
      await axios.post(url, payload);
    },
    async getCurrentUserInfo(context, userID) {
      // get user entry from database (Either the brand new one or one thats already created)
      let url = `/api/userInfo/${userID}`;
      let response = await axios.get(url);
      let currentUserInfo = response.data[0];
      context.commit("UPDATE_USER", currentUserInfo);
      return currentUserInfo;
    },
  },
};
