<template>
  <!-- <div>In the financial dashboard {{ groupID }} {{ groupMembers }}</div> -->
  <div class="createTransaction">
    <button class="btn btn-warning" @click="addTransaction">
      Add Transaction
    </button>
  </div>
  <div v-if="dataReady">
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th scope="col">Buyer</th>
          <th scope="col">Transaction Name</th>
          <th scope="col">Date</th>
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
          <td>{{ item.firstName }} {{ item.lastName }}</td>
          <td>{{ item.transactionname }}</td>
          <td>{{ item.purchasedate }}</td>
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
    viewTransactionDetails: function (transactionID) {
      router.push({
        name: "viewTransaction",
        params: { groupID: this.groupID, transactionID: transactionID },
      });
      // console.log(transactionID);
    },
    addTransaction: function () {
      router.push({
        name: "createTransaction",
        params: { groupID: this.groupID },
      });
    },
    getTransactions: async function () {
      let url = `/api/groupTransaction/${this.groupID}`;
      let response = await axios.get(url);
      let transactions = response.data;
      // console.log(transactions.length);

      for (let i = 0; i < transactions.length; i++) {
        let temptransaction = transactions[i];
        url = `/api/userInfo/${transactions[i].userid}`;
        response = await axios.get(url);
        // console.log(response.data);
        temptransaction.firstName = response.data[0].firstname;
        temptransaction.lastName = response.data[0].lastname;
        temptransaction.purchasedate = this.formatDate(
          temptransaction.purchasedate
        );
        this.transactionList.push(temptransaction);
      }
      // = response.data;
      // console.log(response.data);
    },
    formatDate: function (tempDate) {
      let date = new Date(tempDate);
      var month = date.getUTCMonth() + 1; //months from 1-12
      var day = date.getUTCDate();
      var year = date.getUTCFullYear();

      let newdate = month + "/" + day + "/" + year;
      return newdate;
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
