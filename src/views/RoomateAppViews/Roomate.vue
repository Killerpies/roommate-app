<template>
  <NotLoggedIn v-show="!isAuthenticated"></NotLoggedIn>
  <div class="createJoinGroup" v-if="isAuthenticated">
    <body>
      <h1>Create a Group:</h1>
      <br />
      <button class="btn btn-warning" @click="createGroup">Create Group</button>
      <br />
      <br />
      <h1>Join a Group:</h1>
      <p>
        <strong
          >Youre ID (Copy This):
          <br />
          <br />
        </strong>
      </p>
      <p id="copyUserID">
        {{ userID }}
      </p>
      <br />
      <p>
        Send <strong>Your ID</strong> to <strong>Your Group Leader</strong
        ><br />
        They can add you to the group from the
        <strong>Group Settings Page</strong>
      </p>
    </body>
  </div>
</template>

<script>
// @ is an alias to /src
// import Homepage from "@/components/roomateApp/Dashboard.vue";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import NotLoggedIn from "@/components/NotLoggedIn.vue";
import router from "../../router";

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
    <button onclick="myFunction()">Copy text</button>;
    this.getRelatedGroups();
    this.getcat();
  },
  methods: {
    createGroup: function () {
      router.push({ name: "createGroup" });
    },
    copyId: function () {
      // Get the text field
      var copyText = document.getElementById("copyUserID");

      // Select the text field
      copyText.select();
      copyText.setSelectionRange(0, 99999); // For mobile devices

      // Copy the text inside the text field
      navigator.clipboard.writeText(copyText.value);

      // Alert the copied text
      alert("Copied the text: " + copyText.value);
    },
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
<style>
.createJoinGroup {
  margin: 10px;
  text-align: left;
}
</style>
