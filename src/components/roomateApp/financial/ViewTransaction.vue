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
      <section class="transactionGroupMembers">
        <h1>Members debt:</h1>
        <ul>
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
    await this.getGroupInfo();
    await this.getTransaction();
    await this.getDebtAmounts();
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
ul li {
  text-align: center;
  display: inline-block;
}
.transactionGroupMembers {
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
