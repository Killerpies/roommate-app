<template>
  <div v-if="dataReady && isAuthenticated" class="mainGroupTab">
    <nav
      class="navbar navbar-expand-lg navbar-light"
      style="background-color: #a7c9eb"
    >
      <div class="container-fluid">
        <a class="navbar-brand" href="#"
          >Group: {{ $store.getters.groupname }}</a
        >
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
              <a
                class="nav-link"
                aria-current="page"
                style="cursor: pointer"
                @click="changeTab('calendar')"
                >Calendar</a
              >
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
              <a
                class="nav-link"
                style="cursor: pointer"
                @click="changeTab('chorelist')"
                >Chores</a
              >
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
    <calendar v-if="getCurrentTab == 'calendar'" :groupID="groupID"></calendar>
    <choreList
      v-if="getCurrentTab == 'chorelist'"
      :groupID="groupID"
    ></choreList>
    <adminDashboard
      v-if="getCurrentTab == 'admin'"
      :groupID="groupID"
    ></adminDashboard>
    <financialDashboard
      v-if="getCurrentTab == 'financial'"
      :groupID="groupID"
    ></financialDashboard>
    <groceryList
      v-if="getCurrentTab == 'grocerylist'"
      :groupID="groupID"
    ></groceryList>
  </div>
</template>

<script>
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";
import financialDashboard from "@/components/roomateApp/financial/FinancialDashboard.vue";
import adminDashboard from "@/components/roomateApp/admin/GroupAdmin.vue";
import groceryList from "@/components/roomateApp/grocery/GroceryList.vue";
import choreList from "@/components/roomateApp/chores/ChoreList.vue";
import calendar from "@/components/roomateApp/calendar/GroupCalendar.vue";
// import user from "@/store/modules/user.js";
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
    choreList,
    calendar,
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
      currentTab: "",
      groupInfo: null,
      groupUsers: [],
      currentUserInfo: null,
    };
  },
  async created() {
    this.groupInfo = await this.$store.dispatch("getGroupInfo", this.groupID);
    this.groupUsers = await this.$store.dispatch("getGroupUsers", this.groupID);
    await this.$store.dispatch("getGroupContactInfo", this.getGroupUsers);
    await this.getCurrentUserInfo();
  },
  async mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }
    this.dataReady = true;
  },
  computed: {
    /**
     * These Cannot use state because this is where we initially update the state
     */
    getFirstName() {
      return this.user.given_name;
    },
    getLastName() {
      return this.user.family_name;
    },
    getUserID() {
      return this.user.sub.split("|")[1].replace(/\s/g, "");
    },
    // Here is fine
    getGroupInfo() {
      return this.$store.getters.groupInfo;
    },
    getGroupContactInfo() {
      return this.$store.getters.groupContactInfo;
    },
    getGroupUsers() {
      return this.$store.getters.groupUsers;
    },
    getGroupName() {
      return this.$store.getters.groupname;
    },
    getUserInfo() {
      return this.$store.getters.userInfo;
    },
    isOwner() {
      return this.groupInfo.groupowneruserid == this.getUserID;
    },
    getCurrentTab() {
      return this.$store.getters.currentTab;
    },
  },
  methods: {
    changeTab: function (tab) {
      this.$store.dispatch("changeCurrentTab", tab);
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
html body {
  overflow: auto;
}
</style>
