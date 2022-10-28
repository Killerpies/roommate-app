<template>
  <!-- <div class="goBack">
    <button class="btn btn-warning" @click="backToLastPage">
      Back to Last Page
    </button>
  </div> -->
  <div>
    <h1>Your Groups Groceries</h1>
  </div>
  <div class="mainPage" v-if="dataReady">
    <div v-if="dataReady">
      <hr />
      <table class="table table-hover table-striped">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Check</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in currentGroceryList"
            :key="index"
            style="cursor: pointer"
          >
            <td>{{ item.name }}</td>
            <td>
              <a
                class="nav-link"
                style="cursor: pointer; text-decoration: underline"
                >View Details</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";

export default {
  name: "groceryList",
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
      dataReady: false,
      groupInfo: null,
      groupUsers: [],
      currentGroceryList: [],
    };
  },
  async mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }
    await this.getGroupInfo();
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
    /**
     * Routes user back to last viewed component
     */
    backToLastPage: function () {
      router.back();
    },
    /**
     * Makes call to server getting group name from server
     * Then makes another call to server getting all users attached to the group
     */
    getGroupInfo: async function () {
      let url = `/api/groups/${this.groupID}`;
      this.groupInfo = await axios.get(url);

      url = `/api/userGroupMembers/${this.groupID}`;
      let response = await axios.get(url);
      for (let i = 0; i < response.data.length; i++) {
        let temp = response.data[i];
        temp.percentOwed = 0;
        temp.amountOwed = 0;
        this.groupUsers.push(temp);
      }
    },
    /**
     *
     * Converts string date to proper format (M/D/Y)
     * @param {*} tempDate string date
     */
    formatDate: function (tempDate) {
      let date = new Date(tempDate);
      var month = date.getUTCMonth() + 1; //months from 1-12
      var day = date.getUTCDate();
      var year = date.getUTCFullYear();

      let newdate = month + "/" + day + "/" + year;
      return newdate;
    },
  },
};
</script>

<style>
.mainPage {
  margin: 30px;
  text-align: center;
  padding-right: 10px;
}
.goBack {
  margin: 10px;
  text-align: right;
  padding-right: 10px;
}
</style>
