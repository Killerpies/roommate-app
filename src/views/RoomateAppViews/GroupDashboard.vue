<template>
  <div v-if="dataReady && isAuthenticated" class="mainGroupTab">
    <nav
      class="navbar navbar-expand-lg navbar-light"
      style="background-color: #a7c9eb"
    >
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Group: {{ groupInfo.groupname }}</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a
                class="nav-link"
                aria-current="page"
                style="cursor: pointer"
                @click="changeTab('financial')"
                >Financial</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" style="cursor: pointer">Calendar</a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                aria-current="page"
                style="cursor: pointer"
                @click="changeTab('grocerylist')"
                >Grocery List</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" style="cursor: pointer" href="#">Chores</a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                style="cursor: pointer"
                @click="changeTab('admin')"
                >Settings</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <adminDashboard
      v-if="currentTab == 'admin'"
      :groupID="groupID"
    ></adminDashboard>
    <financialDashboard
      v-if="currentTab == 'financial'"
      :groupID="groupID"
    ></financialDashboard>
    <groceryList
      v-if="currentTab == 'grocerylist'"
      :groupID="groupID"
    ></groceryList>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";
import financialDashboard from "@/components/roomateApp/financial/FinancialDashboard.vue";
import adminDashboard from "@/components/roomateApp/admin/GroupAdmin.vue";
import groceryList from "@/components/roomateApp/grocery/GroceryList.vue";

export default {
  name: "groupDashboard",
  props: {
    groupID: String,
    // likes: Number
  },
  components: {
    financialDashboard,
    adminDashboard,
    groceryList,
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
      dataReady: false,
      currentTab: "financial",
      groupInfo: null,
      groupUsers: [],
      currentUserInfo: null,
    };
  },
  async mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }
    await this.getGroupInfo();
    await this.getCurrentUserInfo();
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
    changeTab: function (tab) {
      this.currentTab = tab;
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
        let url = `/api/userinfo/create`;
        await axios.post(url, payload);

        // get user entry from database (Either the brand new one or one thats already created)
        url = `/api/userInfo/${this.getUserID}`;
        let response = await axios.get(url);
        this.currentUserInfo = response.data[0];
      }
    },
    /**
     * Makes call to server getting group name from server
     * Then makes another call to server getting all users attached to the group
     */
    getGroupInfo: async function () {
      // gets groupID, groupname, groupowner
      let url = `/api/groups/${this.groupID}`;
      let result = await axios.get(url);
      this.groupInfo = result.data[0];
      // gets members of the group
      url = `/api/userGroupMembers/${this.groupID}`;
      let response = await axios.get(url);
      for (let i = 0; i < response.data.length; i++) {
        let tempUser = {
          userid: response.data[i].userid,
          firstName: response.data[i].userfirstname,
          lastName: response.data[i].userlastname,
        };
        this.groupUsers.push(tempUser);
      }
    },
  },
};
</script>

<style></style>
