<template>
  <div>
    <nav
      v-if="groupInfo"
      class="navbar navbar-expand-lg navbar-light"
      style="background-color: #e3f2fd"
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
              <a class="nav-link active" aria-current="page" href="#"
                >Financial</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Calendar</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Chores</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Settings</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    Group
    <financialDashboard
      :groupID="groupID"
      :groupMembers="groupUsers"
    ></financialDashboard>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "../../router";
import financialDashboard from "../../components/roomateApp/financial/FinancialDashboard.vue";

export default {
  name: "groupDashboard",
  props: {
    groupID: String,
    // likes: Number
  },
  components: {
    financialDashboard,
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
      groupInfo: null,
      groupUsers: [],
      currentUserInfo: null,
    };
  },
  mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }
    this.getCurrentUserInfo();
    this.getGroupInfo();
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
    getCurrentUserInfo: async function () {
      // If user does not exist then will create a user entry
      let payload = {
        userid: this.getUserID,
        firstname: this.getFirstName,
        lastname: this.getLastName,
        phonenumber: null,
        email: null,
      };
      let url = `/api/userinfo/create`;
      await axios.post(url, payload);

      // get user entry from database (Either the brand new one or one thats already created)
      url = `/api/userInfo/${this.getUserID}`;
      let response = await axios.get(url);
      this.currentUserInfo = response.data[0];
    },
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
