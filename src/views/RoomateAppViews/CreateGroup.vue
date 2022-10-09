<template>
  <div v-show="isAuthenticated">
    <h1>Create A Group:</h1>
    <div class="formArea">
      <input
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
