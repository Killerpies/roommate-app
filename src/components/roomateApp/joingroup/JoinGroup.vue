<template>
  <div v-if="dataReady" class="createTransaction">
    <h1 v-if="!validInvite">This invite is not valid</h1>
    <h1 v-if="!notInGroup">You are already a part of this group</h1>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";

export default {
  name: "joinGroup",
  props: {
    inviteID: String,
  },
  setup() {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
    return {
      login: () => {
        loginWithRedirect({
          appState: { target: `${window.location.pathname}` },
        });
        // {redirect_uri: `${window.location.href}`,}
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
      dataReady: false,
      groupInfo: null,
      groupUsers: [],
      inviteDetails: {},
      validInvite: false,
      notInGroup: false,
      allGroups: [],
    };
  },
  async mounted() {
    if (!this.isAuthenticated) {
      this.login();
    }
    // console.log(window.location.href);
    await this.getCurrentUserInfo();
    await this.checkInvite();
    await this.checkIfInGroup();
    if (this.validInvite && this.notInGroup) {
      await this.acceptGroupInvite();
    }
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
      router.push({ name: "roommateapp" });
    },
    checkInvite: async function () {
      let url = `/api/groupInvites/findInvite/${this.inviteID}`;
      let response = await axios.get(url);
      this.inviteDetails = response.data[0];
      this.validInvite = this.inviteDetails.activeinvite;
    },
    checkIfInGroup: async function () {
      let notInGroup = true;
      this.allGroups = await this.$store.dispatch(
        "getRelatedGroups",
        this.getUserID
      );
      // console.log(this.allGroups);
      for (let i = 0; i < this.allGroups.length; i++) {
        console.log(this.allGroups[i]);
        if (this.allGroups[i].groupid == this.inviteDetails.groupid) {
          notInGroup = false;
        }
      }
      this.notInGroup = notInGroup;
    },
    /**
     * Takes userID of person who is meant to be invited
     * Finds their info in database
     * Then adds them to current group in groupUsers table
     */
    acceptGroupInvite: async function () {
      let url = `/api/userinfo/${this.getUserID}`;
      let response = await axios.get(url);
      if (response.data.length > 0) {
        let payload = {
          userID: this.getUserID,
          newGroupID: this.inviteDetails.groupid,
          firstName: response.data[0].firstname,
          lastName: response.data[0].lastname,
        };
        url = `/api/groups/join`;
        await axios.post(url, payload);
        await this.$store.dispatch("resolveGroupInvite", this.inviteID);
        router.push({ name: "roommateapp" });
      }
    },
    /**
     * This function takes a users info given from their account and adds it to the database
     * If the user already exists then it will just pull the old info
     * If the user does not exist then it adds them to the database
     */
    getCurrentUserInfo: async function () {
      // If user does not exist then will create a user entry
      if (this.isAuthenticated) {
        let payload = {
          userID: this.getUserID,
          firstName: this.getFirstName,
          lastName: this.getLastName,
        };
        await this.$store.dispatch("createUser", payload);
        this.currentUserInfo = await this.$store.dispatch(
          "getCurrentUserInfo",
          this.getUserID
        );
      }
    },
  },
};
</script>

<style>
.createTransaction {
  text-align: center;
  margin: auto;
  width: 60%;
  /* border: 3px solid green; */
  padding: 10px;
}

@media only screen and (max-width: 768px) {
  .createTransaction {
    text-align: center;
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
