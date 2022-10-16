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
    };
  },
  mounted() {
    // if (!this.isAuthenticated) {
    //   router.push({ name: "home" });
    // }
    this.getGroupInfo();
    this.getTransaction();
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
    getTransaction: async function () {
      let url = `/api/transaction/${this.transactionID}`;
      let response = await axios.get(url);
      let transaction = response.data[0];
      this.transactionDetails = transaction;
      this.transactionDetails.purchasedate = this.formatDate(
        transaction.purchasedate
      );
      url = `/api/userInfo/${transaction.userid}`;
      response = await axios.get(url);
      this.transactionDetails.firstName = response.data[0].firstname;
      this.transactionDetails.lastName = response.data[0].lastname;
      console.log(this.transactionDetails);
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
.goBack {
  margin: 10px;
  text-align: right;
  padding-right: 10px;
}
</style>
