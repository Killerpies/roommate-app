<template>
  <NotLoggedIn v-show="!isAuthenticated"></NotLoggedIn>
  <div class="createJoinGroup" v-if="isAuthenticated">
    <body>
      <section v-if="groupInfo.length > 0">
        <h1>Your Groups</h1>
        <article class="formArea">
          <select
            id="selectedGroup"
            class="form-select"
            aria-label="Default select example"
          >
            <!-- <option selected>Open this select menu</option> -->
            <option
              v-for="(item, index) in groupInfo"
              :key="index"
              v-bind:value="item.groupid"
            >
              {{ item.groupname }}
            </option>
          </select>
        </article>
        <br />
        <button class="btn btn-secondary" @click="goToGroup">
          Go to group
        </button>
      </section>
      <section v-else>
        <h1>No groups found, create or join one below</h1>
      </section>
      <section>
        <br />
        <br />
        <h1>Create a Group:</h1>
        <br />
        <button class="btn btn-secondary" @click="createGroup">
          Create Group
        </button>
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
          {{ getUserID }}
        </p>
        <br />
        <p>
          Send <strong>Your ID</strong> to <strong>Your Group Leader</strong
          ><br />
          They can add you to the group from the
          <strong>Group Settings Page</strong>
        </p>
      </section>
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
    };
  },
  async mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }

    this.getRelatedGroups();
    this.getCurrentUserInfo();
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
        let url = `/api/userinfo/create`;
        await axios.post(url, payload);

        // get user entry from database (Either the brand new one or one thats already created)
        url = `/api/userInfo/${this.getUserID}`;
        let response = await axios.get(url);
        this.currentUserInfo = response.data[0];
      }
    },
    /**
     * Gets the selected groupID from the dropdown
     * Routes the user to groupDashboard
     * Passes the groupID along with them
     */
    goToGroup: function () {
      var x = document.getElementById("selectedGroup").value;
      router.push({ name: "groupDashboard", params: { groupID: x } });
    },
    /**
     * routes the user to the createGroupDashboard
     */
    createGroup: function () {
      router.push({ name: "createGroup" });
    },
    /**
     * Takes the current userID
     * Finds groups associated with that ID
     * For each group Then get the groupNames associated with them and add to list of objects
     */
    getRelatedGroups: async function () {
      try {
        let url = `/api/usergroups/${this.getUserID}`;
        let data = await axios.get(url);
        this.groups = data.data;
      } catch (error) {
        console.error(error);
      }
      try {
        let tempGroups = [];
        for (let i = 0; i < this.groups.length; i++) {
          let url = `/api/groups/${this.groups[i].groupid}`;
          let data = await axios.get(url);
          if (data.data[0]) {
            tempGroups.push(data.data[0]);
          }
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
.formArea {
  text-align: right;
  margin: left;
  width: 40%;
  /* border: 3px solid green; */
  /* padding: 10px; */
}
</style>
