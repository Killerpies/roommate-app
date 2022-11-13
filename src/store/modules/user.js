import axios from "axios";
export default {
  state: {
    userInfo: null,
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    userid: "",
  },
  getters: {
    firstname: function (state) {
      return state.firstname;
    },
    lastname: function (state) {
      return state.lastname;
    },
    email: function (state) {
      return state.email;
    },
    phoneNumber: function (state) {
      return state.phoneNumber;
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
      state.email = payload.email;
      state.phoneNumber = payload.phonenumber;
    },
    SET_FIRST_NAME(state, firstname) {
      state.firstname = firstname;
    },
    SET_LAST_NAME(state, lastname) {
      state.lastname = lastname;
    },
    SET_EMAIL(state, email) {
      state.email = email;
    },
    SET_PHONE_NUMBER(state, phoneNumber) {
      state.phoneNumber = phoneNumber;
    },
    SET_USER_ID(state, userID) {
      state.userID = userID;
    },
  },
  actions: {
    async updateEmail(context, payload) {
      let url = `/api/updateUserInfo/update/email/${payload.userID}`;
      await axios.post(url, payload);
      context.commit("SET_EMAIL", payload.email);
    },
    async updateFirstName(context, payload) {
      let url = `/api/updateUserInfo/update/firstName/${payload.userID}`;
      await axios.post(url, payload);
      context.commit("SET_FIRST_NAME", payload.firstName);
    },
    async updateLastName(context, payload) {
      let url = `/api/updateUserInfo/update/lastName/${payload.userID}`;
      await axios.post(url, payload);
      context.commit("SET_LAST_NAME", payload.lastName);
    },
    async updatePhoneNumber(context, payload) {
      let url = `/api/updateUserInfo/update/phoneNumber/${payload.userID}`;
      await axios.post(url, payload);
      context.commit("SET_PHONE_NUMBER", payload.phoneNumber);
    },
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
