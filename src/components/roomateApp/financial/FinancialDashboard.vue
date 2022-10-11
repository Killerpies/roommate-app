<template>
  <!-- <div>In the financial dashboard {{ groupID }} {{ groupMembers }}</div> -->
  <div class="createTransaction">
    <button class="btn btn-warning" @click="addTransaction">
      Add Transaction
    </button>
  </div>
  <div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Transaction Name</th>
          <th scope="col">Description</th>
          <th scope="col">Date</th>
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>10-11-2022</td>
          <td>$100</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>10-11-2022</td>
          <td>$200</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "../../../router";

export default {
  name: "financialDashboard",
  props: {
    groupID: String,
    groupMembers: Array,
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
      groupUsers: null,
    };
  },
  mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }
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
    addTransaction: function () {
      router.push({
        name: "createTransaction",
        params: { groupID: this.groupID },
      });
    },
    getGroupInfo: async function () {
      let url = `/api/groups/${this.groupID}`;
      this.groupInfo = await axios.get(url);

      url = `/api/userGroupMembers/${this.groupID}`;
      let response = await axios.get(url);
      this.groupUsers = response.data;
    },
  },
};
</script>

<style>
.createTransaction {
  margin: 10px;
  text-align: right;
  padding-right: 10px;
}
</style>
