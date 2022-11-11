<template>
  <div class="goBack">
    <button class="btn btn-warning" @click="backtoFinancial">
      Back to Financial
    </button>
  </div>
  <div v-if="dataReady">
    <main>
      <section class="viewTransaction">
        <h1>
          Viewing Transaction Details for:
          {{ transactionDetails.transactionname }}
        </h1>
        <p>
          <strong>Buyer: </strong>{{ transactionDetails.firstName }}
          {{ transactionDetails.lastName }}<br />
          <strong>Amount: </strong> ${{ transactionDetails.transactionamount }}
          <br />
          <strong>Date: </strong> {{ transactionDetails.purchasedate }} <br />
          <strong>Description:</strong><br />
          {{ transactionDetails.transactiondescription }}
        </p>
      </section>
      <section class="viewTransaction">
        <h1>Members debt:</h1>
        <ul class="transactionGroupMembers">
          <li v-for="(item, index) in memberDebt" :key="index">
            {{ item.firstName }} {{ item.lastName }} - Amount Owed: ${{
              item.amountowed
            }}
            - Amount Payed: ${{ item.amountpayed }}
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";

export default {
  name: "viewTransaction",
  props: {
    groupID: String,
    transactionID: String,
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
      transactionDetails: {},
      memberDebt: [],
    };
  },
  async mounted() {
    // if (!this.isAuthenticated) {
    //   router.push({ name: "home" });
    // }
    this.groupInfo = this.getGroupInfo;
    this.groupUsers = this.getGroupUsers;
    await this.getTransaction();
    await this.getDebtAmounts();
    this.dataReady = true;
  },
  computed: {
    getFirstName() {
      return this.$store.getters.firstname;
    },
    getLastName() {
      return this.$store.getters.lastname;
    },
    getUserID() {
      return this.$store.getters.userid;
    },
    getGroupInfo() {
      return this.$store.getters.groupInfo;
    },
    getGroupUsers() {
      return this.$store.getters.groupUsers;
    },
  },
  methods: {
    /**
     * Routes user back to last viewed component
     * Should be financial
     */
    backtoFinancial: function () {
      router.back();
    },
    /**
     * Searches for this users debt using transactionID
     * Then pulls all user info for each row of debt and assigns their info to each debt transaction
     */
    getDebtAmounts: async function () {
      let url = `/api/userDebt/${this.transactionID}`;
      let response = await axios.get(url);
      this.memberDebt = response.data;
      for (let i = 0; i < this.memberDebt.length; i++) {
        let url = `/api/userinfo/${this.memberDebt[i].userowedid}`;
        let response = await axios.get(url);
        let memberInfo = response.data[0];
        this.memberDebt[i].firstName = memberInfo.firstname;
        this.memberDebt[i].lastName = memberInfo.lastname;
      }
    },
    /**
     * Call to server to get transactions for this group
     * Then for each transaction gets each user who is attached to the transaction
     * Adds their name, and purchase date to each transaction
     */
    getTransaction: async function () {
      let url = `/api/transaction/${this.transactionID}`;
      let response = await axios.get(url);
      let transaction = response.data[0];
      let tempTrans = {};
      tempTrans = transaction;
      tempTrans.purchasedate = this.formatDate(transaction.purchasedate);
      url = `/api/userInfo/${transaction.userid}`;
      let result = await axios.get(url);
      tempTrans.firstName = result.data[0].firstname;
      tempTrans.lastName = result.data[0].lastname;
      this.transactionDetails = tempTrans;
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
.viewTransaction {
  margin: 30px;
  text-align: center;
  padding-right: 10px;
}
.transactionGroupMembers {
  margin: 30px;
  text-align: center;
  padding-right: 10px;
  display: inline-block;
  text-align: left;
}
.goBack {
  margin: 10px;
  text-align: right;
  padding-right: 10px;
}
</style>
