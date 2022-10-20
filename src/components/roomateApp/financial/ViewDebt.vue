<template>
  <div>
    <h1>Money You Owe</h1>
  </div>
  <div class="row">
    <div class="col">
      <button class="btn btn-warning" @click="backtoFinancial">
        Back to financial
      </button>
    </div>
  </div>

  <div v-if="dataReady">
    <hr />
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Payed By</th>
          <th scope="col">Transaction Name</th>
          <th scope="col">Amount Owed</th>
          <th scope="col">View Transaction</th>
          <th scope="col">Pay Debt</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in debtTransactionList" :key="item.debtid">
          <td v-if="item.activetransaction">{{ item.purchasedate }}</td>
          <td v-if="item.activetransaction">
            {{ item.firstName }} {{ item.lastName }}
          </td>
          <td v-if="item.activetransaction">{{ item.transactionname }}</td>

          <td v-if="item.activetransaction">${{ item.currentAmountOwed }}</td>
          <td>
            <a
              v-if="item.activetransaction"
              class="nav-link"
              style="cursor: pointer; text-decoration: underline"
              @click="viewTransactionDetails(item.transactionid)"
              >View Details</a
            >
          </td>
          <td v-if="item.activetransaction">
            <a
              class="nav-link"
              style="cursor: pointer; text-decoration: underline"
              @click="
                payTransaction(
                  item.deptid,
                  item.userid,
                  item.amountowed,
                  item.amountpayed
                )
              "
              >Pay off</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="debtTransactionList.length == 0">
    <h1>No transactions found</h1>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";

export default {
  name: "viewDebt",
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
      debtTransactionList: [],
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
    backtoFinancial: function () {
      router.back();
    },
    viewTransactionDetails: function (transactionID) {
      router.push({
        name: "viewTransaction",
        params: { groupID: this.groupID, transactionID: transactionID },
      });
    },
    getTransactions: async function () {
      let url = `/api/specificUserDebt/${this.getUserID}`;
      let response = await axios.get(url);
      let transactions = response.data;
      for (let i = 0; i < transactions.length; i++) {
        let tempTransaction = {};
        tempTransaction = transactions[i];
        let url = `/api/transaction/${tempTransaction.transactionid}`;
        let result = await axios.get(url);
        tempTransaction.transactionname = result.data[0].transactionname;
        tempTransaction.transactionamount = result.data[0].transactionamount;
        tempTransaction.purchasedate = this.formatDate(
          result.data[0].purchasedate
        );
        tempTransaction.currentAmountOwed =
          tempTransaction.amountowed - tempTransaction.amountpayed;
        url = `/api/userinfo/${tempTransaction.userid}`;
        response = await axios.get(url);
        tempTransaction.firstName = response.data[0].firstname;
        tempTransaction.lastName = response.data[0].lastname;
        if (tempTransaction.groupid == this.groupID) {
          this.debtTransactionList.push(transactions[i]);
        }
      }

      this.debtTransactionList.reverse();
    },
    //eslint-disable-next-line
    payTransaction: async function (debtID, userID, amountowed, amountpayed) {
      let url = `/api/specificUserDebt/changeDebt`;
      let payload = {
        debtID: debtID,
        userID: userID,
        amountowed: amountowed,
        amountpayed: amountowed,
        activetransaction: false,
      };
      await axios.post(url, payload);
      let index = this.debtTransactionList.findIndex(
        (x) => x.deptid === debtID
      );
      this.debtTransactionList.splice(index, 1);
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
}
</style>
