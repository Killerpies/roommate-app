<template>
  <div>
    <h1>Your Groups Transactions</h1>
    <h1>{{ $store.getters.firstname }}</h1>
  </div>
  <div class="row">
    <div class="col">
      <button class="btn btn-warning" @click="viewDebt">View My Debt</button>
    </div>
    <div class="col">
      <button class="btn btn-warning" @click="addTransaction">
        Add Transaction
      </button>
    </div>
  </div>

  <div v-if="dataReady">
    <hr />
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Buyer</th>
          <th scope="col">Transaction Name</th>
          <th scope="col">Amount</th>
          <th scope="col">Details</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in transactionList"
          :key="index"
          v-on:dblclick="viewTransactionDetails(item.transactionid)"
          style="cursor: pointer"
        >
          <td>{{ item.purchasedate }}</td>
          <td>{{ item.firstName }} {{ item.lastName }}</td>
          <td>{{ item.transactionname }}</td>

          <td>${{ item.transactionamount }}</td>
          <td>
            <a
              class="nav-link"
              style="cursor: pointer; text-decoration: underline"
              @click="viewTransactionDetails(item.transactionid)"
              >View Details</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="transactionList.length == 0">
    <h1>No transactions found</h1>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";

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
      dataReady: false,
      groupInfo: null,
      groupUsers: null,
      transactionList: [],
    };
  },
  mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }
    this.getGroupInfo();
    this.getTransactions();
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
     * Routes the user to the viewDebt dashboard
     * Passes the groupID to the viewDebt dashboard
     */
    viewDebt: function () {
      router.push({
        name: "viewDebt",
        params: { groupID: this.groupID },
      });
    },
    /**
     * Routes the user to the view transaction dashboard
     * Passes this groupID and the transactionID to the view transaction dashboard
     * @param {*} transactionID ID of transaction wished to be viewed
     */
    viewTransactionDetails: function (transactionID) {
      router.push({
        name: "viewTransaction",
        params: { groupID: this.groupID, transactionID: transactionID },
      });
    },
    /**
     * routes user to create transaction dashboard
     * passes the current groupID to the create dashboard
     */
    addTransaction: function () {
      router.push({
        name: "createTransaction",
        params: { groupID: this.groupID },
      });
    },
    /**
     * Call to server to get transactions for this group
     * Then for each transaction gets each user who is attached to the transaction
     * Adds their name, and purchase date to each transaction
     */
    getTransactions: async function () {
      let url = `/api/groupTransaction/${this.groupID}`;
      let response = await axios.get(url);
      let transactions = response.data;

      for (let i = 0; i < transactions.length; i++) {
        let temptransaction = transactions[i];
        url = `/api/userInfo/${transactions[i].userid}`;
        response = await axios.get(url);
        temptransaction.firstName = response.data[0].firstname;
        temptransaction.lastName = response.data[0].lastname;
        temptransaction.purchasedate = this.formatDate(
          temptransaction.purchasedate
        );
        this.transactionList.push(temptransaction);
      }
      this.transactionList.reverse();
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
    /**
     * Makes call to server getting group name from server
     * Then makes another call to server getting all users attached to the group
     */
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
}
</style>
