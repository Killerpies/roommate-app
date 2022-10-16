<template>
  <div v-if="groupUsers.length > 0" class="createTransaction">
    <button class="btn btn-warning" @click="backtoFinancial">
      Back to Financial
    </button>
    <h1 style="text-align: center">Create a Transaction</h1>
    <div class="input-group mb-3">
      <span class="input-group-text" id="basic-addon1">Transaction Name</span>
      <input
        v-model="transactionDetails.transactionName"
        type="text"
        class="form-control"
        placeholder="Enter a name for transaction"
        aria-label="Username"
        aria-describedby="basic-addon1"
      />
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">Transaction Description</span>
      <textarea
        v-model="transactionDetails.transactionDescription"
        class="form-control"
        aria-label="With textarea"
        placeholder="Enter a description"
      ></textarea>
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">Total Amount $</span>
      <input
        v-model="transactionDetails.transactionAmount"
        type="number"
        class="form-control"
        aria-label="Amount (to the nearest dollar)"
        placeholder="Enter Transaction Amount"
      />
      <span class="input-group-text">.00</span>
    </div>
    <div
      v-for="(item, index) in groupUsers"
      :key="index"
      class="input-group mb-3"
    >
      <span class="input-group-text"
        >{{ item.userfirstname }} {{ item.userlastname }}</span
      >
      <input
        type="number"
        class="form-control"
        aria-label="Amount (to the nearest dollar)"
        placeholder="Enter Percentage Owed"
        v-model="groupUsers[index].percentOwed"
      />
      <input
        type="number"
        class="form-control"
        aria-label="Amount (to the nearest dollar)"
        placeholder="Enter Amount $"
        v-model="groupUsers[index].amountOwed"
      />
      <span class="input-group-text">.00</span>
    </div>
    <button class="btn btn-warning" @click="createTransaction">
      Create Transaction
    </button>

    <br />
    {{ groupUsers[0].percentOwed }}
    <br />
    {{ groupUsers[0].amountOwed }}
    <br />
    {{ transactionDetails }}
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";

export default {
  name: "createTransaction",
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
      transactionDetails: {
        groupID: this.groupID,
        userID: this.user.sub.split("|")[1].replace(/\s/g, ""),
        transactionName: "",
        transactionDescription: "",
        transactionAmount: null,
        transactionDate: this.getCurrentDate(),
      },
      groupInfo: null,
      groupUsers: [],
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
    backtoFinancial: function () {
      router.back();
    },
    createTransaction: async function () {
      let url = `/api/groupTransaction/create`;
      let response = await axios.post(url, this.transactionDetails);
      let transID = response.data.rows[0].transactionid;
      console.log(transID);

      url = `/api/userDebt/create`;
      for (let i = 0; i < this.groupUsers.length; i++) {
        let payload = {
          userID: this.getUserID,
          groupID: this.groupID,
          transactionID: transID,
          percentOwed: this.groupUsers[i].percentOwed,
          amountOwed: this.groupUsers[i].amountOwed,
          userOwedID: this.groupUsers[i].userid,
          activeTransaction: true,
        };
        await axios.post(url, payload);
        // console.log(payload);
      }
      router.back();
      // console.log(this.getCurrentDate());
    },
    getCurrentDate: function () {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = mm + "/" + dd + "/" + yyyy;
      return today;
    },
    getGroupInfo: async function () {
      let url = `/api/groups/${this.groupID}`;
      this.groupInfo = await axios.get(url);

      url = `/api/userGroupMembers/${this.groupID}`;
      let response = await axios.get(url);
      for (let i = 0; i < response.data.length; i++) {
        let temp = response.data[i];
        // temp.percentOwed = 0;
        // temp.amountOwed = 0;
        this.groupUsers.push(temp);
      }
      //   this.groupUsers = response.data;
    },
  },
};
</script>

<style>
.createTransaction {
  text-align: right;
  margin: auto;
  width: 70%;
  /* border: 3px solid green; */
  padding: 10px;
}
.goBack {
  text-align: left;
  margin: auto;
  width: 70%;
  /* border: 3px solid green; */
  padding: 10px;
}
.formArea {
  text-align: right;
  margin: auto;
  width: 70%;
  /* border: 3px solid green; */
  padding: 10px;
}
</style>
