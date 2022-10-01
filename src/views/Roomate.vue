<template>
  <div class="home" v-show="!isAuthenticated">
    <NotLoggedIn></NotLoggedIn>
  </div>
  <div v-if="isAuthenticated">
    <div class="row">
      <div class="col">
        <h3>Your group:</h3>
      </div>
      <div class="col">
        <select
          class="form-select form-select-sm"
          aria-label="Default select example"
        >
          <option selected>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div>
        <pre v-if="isAuthenticated">
        <code>{{ user }}</code>
        <code>{{user.id}}</code>
      </pre>
      </div>
    </div>
    <h1>HERE IS WHERE LIST IS GroupInfo</h1>
    <div v-for="(item, index) in groupInfo" v-bind:key="index">
      <li>{{ item }}</li>
    </div>
    <h1>HERE IS WHERE LIST IS UserGroups</h1>
    <div v-for="(item, index) in groups" v-bind:key="index">
      <li>{{ item }}</li>
    </div>
    <h1>HERE IS WHERE LIST IS</h1>
    <div v-for="(item, index) in catnames" v-bind:key="index">
      <li>{{ item.name }}</li>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Homepage from "@/components/roomateApp/Dashboard.vue";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import NotLoggedIn from "@/components/NotLoggedIn.vue";

export default {
  name: "RoommateView",
  components: {
    // Homepage,
    NotLoggedIn,
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
      userID: null,
      groups: [],
      groupInfo: [],
      catnames: [],
    };
  },
  mounted() {
    this.getUserID();
    this.getRelatedGroups();
    this.getcat();
  },
  methods: {
    getcat: async function () {
      try {
        let url = "/api/cats";

        let data = await axios.get(url);
        this.catnames = data.data;
      } catch (error) {
        console.error(error);
      }
    },
    getUserID: function () {
      let tempid = this.user.sub.split("|")[1].replace(/\s/g, "");
      this.userID = tempid;
      return this.userID;
    },
    getRelatedGroups: async function () {
      try {
        let url = `/api/usergroups/${this.getUserID()}`;
        let data = await axios.get(url);
        this.groups = data.data;
      } catch (error) {
        console.error(error);
      }
      try {
        let tempGroups = [];
        for (let i = 0; i < this.groups.length; i++) {
          console.log(this.groups[i]);
          let url = `/api/groups/${this.groups[i].usergroupid}`;
          let data = await axios.get(url);
          tempGroups.push(data.data);
        }
        this.groupInfo = tempGroups;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
