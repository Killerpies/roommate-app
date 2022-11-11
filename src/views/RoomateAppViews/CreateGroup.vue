<template>
  <div v-show="isAuthenticated">
    <h1>Create A Group:</h1>
    <div class="formArea">
      <input
        v-on:keyup.enter="createGroup"
        v-model="groupName"
        class="form-control form-control-lg"
        type="text"
        placeholder="Enter Your Groups Name"
        aria-label=".form-control-lg example"
      />
      <button class="btn btn-warning" @click="createGroup">Create Group</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "../../router";

export default {
  name: "roommateCreateGroup",
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
      groupName: "",
    };
  },
  mounted() {},
  computed: {
    getFirstName() {
      return this.$store.getters.firstname;
    },
    getLastName() {
      return this.$store.getters.lastname;
    },
    getUserID() {
      return this.$store.getters.userid;
    },
  },
  methods: {
    /**
     * Takes the current users ID, Name, and the groupName they chose
     * Adds those to the database
     * Also adds the user to the group
     */
    createGroup: async function () {
      //(groupName, groupOwnerUserID, groupOwnerUserFirstName, groupOwnerUserLastName)
      let url = `/api/groups/create`;
      let payload = {
        groupName: this.groupName,
        groupOwnerUserID: this.getUserID,
        groupOwnerUserFirstName: this.getFirstName,
        groupOwnerUserLastName: this.getLastName,
      };
      await axios.post(url, payload);
      router.push({ name: "roommateapp" });
    },
  },
};
</script>

<style>
.formArea {
  text-align: right;
  margin: auto;
  width: 70%;
  /* border: 3px solid green; */
  padding: 10px;
}
button {
  text-align: left;
  margin-top: 10px;
}
</style>
