<template>
  <div v-if="dataReady" class="createTransaction">
    <button class="btn btn-warning" @click="acceptGroupInvite">
      Accept Group Invite
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";

export default {
  name: "joinGroup",
  props: {
    groupID: String,
  },
  setup() {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
    return {
      login: () => {
        loginWithRedirect();
      },
      logout: () => {
        logout({ returnTo: window.location.origin });
      },
      user,
      isAuthenticated,
    };
  },
  data() {
    return {
      newItem: "",
      listName: "",
      listContents: [],
      dataReady: false,
      groupInfo: null,
      groupUsers: [],
    };
  },
  mounted() {
    if (!this.isAuthenticated) {
      this.login();
    }
    this.getCurrentUserInfo();
    this.dataReady = true;
  },
  computed: {
    getFirstName() {
      return this.user.given_name;
    },
    getLastName() {
      return this.user.family_name;
    },
    getUserID() {
      return this.user.sub.split("|")[1].replace(/\s/g, "");
    },
  },
  methods: {
    backHome: function () {
      router.push({ name: "home" });
    },
    getCurrentUserInfo: async function () {
      // If user does not exist then will create a user entry
      if (this.isAuthenticated) {
        let payload = {
          userID: this.getUserID,
          firstName: this.getFirstName,
          lastName: this.getLastName,
        };
        let url = `/api/userinfo/create`;
        await axios.post(url, payload);

        // get user entry from database (Either the brand new one or one thats already created)
        url = `/api/userInfo/${this.getUserID}`;
        let response = await axios.get(url);
        this.currentUserInfo = response.data[0];
      }
    },
    /**
     * Takes userID of person who is meant to be invited
     * Finds their info in database
     * Then adds them to current group in groupUsers table
     */
    inviteMemberNoEmail: async function () {
      let url = `/api/userinfo/${this.getUserID}`;
      let response = await axios.get(url);
      if (response.data.length > 0) {
        let payload = {
          userID: this.getUserID,
          newGroupID: this.groupID,
          firstName: response.data[0].firstname,
          lastName: response.data[0].lastname,
        };
        url = `/api/groups/join`;
        await axios.post(url, payload);
        alert(
          `Invited: ${response.data[0].firstname} ${response.data[0].lastname}`
        );
      } else {
        alert(`Could Not find user: ${this.inviteUserID}`);
      }
      this.inviteUserID = "";
    },
    acceptGroupInvite: async function () {
      let url = ``;
      let payload = {};
      await axios.post(url, payload);
    },
  },
};
</script>

<style>
.createTransaction {
  text-align: right;
  margin: auto;
  width: 60%;
  /* border: 3px solid green; */
  padding: 10px;
}

@media only screen and (max-width: 768px) {
  .createTransaction {
    text-align: right;
    margin: auto;
    width: 90%;
    padding: 10px;
  }
  /* For mobile phones: */
  label,
  span {
    width: 60px;
    /* overflow: hidden; */
    display: inline-block;
    inline-size: min-content;
    /* text-overflow: ellipsis; */
    /* white-space: nowrap; */
  }
}
</style>
