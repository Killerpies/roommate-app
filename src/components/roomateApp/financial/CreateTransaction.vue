<template>
  <div v-if="groupUsers.length > 0" class="createTransaction">
    <button class="btn btn-warning" @click="backtoFinancial">
      Back to Financial
    </button>
    <h1 style="text-align: center">Create a Transaction</h1>
    <form v-on:submit.prevent="createTransaction">
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">Name</span>
        <input
          v-model="transactionDetails.transactionName"
          type="text"
          class="form-control"
          placeholder="Enter a name for transaction"
          aria-label="Username"
          aria-describedby="basic-addon1"
          :state="validateMe('transactionName')"
          required
        />
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text">Description</span>
        <textarea
          v-model="transactionDetails.transactionDescription"
          class="form-control"
          aria-label="With textarea"
          placeholder="Enter a description"
        ></textarea>
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text">Price $</span>
        <input
          v-model="transactionDetails.transactionAmount"
          type="number"
          class="form-control"
          aria-label="Amount (to the nearest dollar)"
          placeholder="Enter Transaction Amount"
          :state="validateMe('totalAmount')"
          @input="adjustInitialValues"
          step="0.01"
          required
        />
      </div>
      <div
        v-for="(item, index) in groupUsers"
        :key="index"
        class="input-group mb-3"
      >
        <span class="input-group-text"
          >{{ item.firstName }} {{ item.lastName }}</span
        >
        <input
          type="number"
          class="form-control"
          aria-label="Amount (to the nearest dollar)"
          placeholder="Percentage %"
          v-model="groupUsers[index].percentOwed"
          :state="validateMe('userPercentOwed')"
          @input="adjustOnPercentageChange(index)"
          step="0.01"
          required
        />
        <input
          type="number"
          class="form-control"
          aria-label="Amount (to the nearest dollar)"
          placeholder="Amount $"
          v-model="groupUsers[index].amountOwed"
          :state="validateMe('userAmountOwed')"
          @input="adjustOnAmountChange(index)"
          step="0.01"
          required
        />
      </div>
      <button class="btn btn-warning">Create Transaction</button>
    </form>
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
    this.groupInfo = this.getGroupInfo;
    this.groupUsers = this.getGroupUsers;
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
     * After user types in total amount
     * automagically calculates percentage and total for all users
     */
    adjustInitialValues: function () {
      let numberOfUsers = this.groupUsers.length;
      let amountSplit =
        this.transactionDetails.transactionAmount / numberOfUsers;
      let percentageSplit =
        (amountSplit / this.transactionDetails.transactionAmount) * 100;

      for (let i = 0; i < numberOfUsers; i++) {
        this.groupUsers[i].amountOwed = amountSplit;
        this.groupUsers[i].percentOwed = percentageSplit;
      }
    },
    /**
     * After user types in amount on specific person,
     * auto magically calculates the percentage that user owes
     * @param {*} index location of user in array
     */
    adjustOnAmountChange: function (index) {
      let amount = this.groupUsers[index].amountOwed;
      let percentage =
        (amount / this.transactionDetails.transactionAmount) * 10;
      this.groupUsers[index].percentOwed = percentage;
    },
    /**
     * After user types in percentage on specific person,
     * auto magically calculates the amount that user owes
     * @param {*} index location of user in array
     */
    adjustOnPercentageChange: function (index) {
      let percent = this.groupUsers[index].percentOwed * 0.01;
      let amount = this.transactionDetails.transactionAmount * percent;
      this.groupUsers[index].amountOwed = amount;
    },
    /**
     * Routes back to the last page visited
     * Should be financial
     */
    backtoFinancial: function () {
      router.back();
    },
    /**
     * Takes this transactions details and posts them to the server
     * Then takes each users debt adds this too an object
     * Pushes those objects into a list and sends them to the server
     * @param {*} event Event returned from form to prevent form from refreshing on button press
     */
    createTransaction: async function (event) {
      event.preventDefault;
      let url = `/api/groupTransaction/create`;
      let response = await axios.post(url, this.transactionDetails);
      let transID = response.data.rows[0].transactionid;

      url = `/api/userDebt/create`;
      for (let i = 0; i < this.groupUsers.length; i++) {
        let payload = {
          userID: this.getUserID,
          groupID: this.groupID,
          transactionID: transID,
          percentOwed: this.groupUsers[i].percentOwed,
          amountOwed: this.groupUsers[i].amountOwed,
          userOwedID: this.groupUsers[i].userid,
          amountPayed: 0,
          activeTransaction: true,
        };
        if (this.groupUsers[i].userid == this.getUserID) {
          payload.amountPayed = this.groupUsers[i].amountOwed;
          payload.activeTransaction = false;
        }
        await axios.post(url, payload);
      }
      router.back();
    },
    /**
     * Returns todays date
     */
    getCurrentDate: function () {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = mm + "/" + dd + "/" + yyyy;
      return today;
    },
    /**
     * Checks to see if all users have valid amount owed attached to their account
     */
    validateUserAmountOwed: function () {
      let state = true;
      for (let i = 0; i < this.groupUsers.length; i++) {
        if (
          this.groupUsers[i].amountOwed ||
          this.groupUsers[i].amountOwed == 0 ||
          this.groupUsers[i].amountOwed == null ||
          this.groupUsers[i].amountOwed >
            this.transactionDetails.transactionAmount
        ) {
          state = false;
        }
      }
      return state;
    },
    /**
     * Checks to see if all users have valid percent owed attached to their account
     */
    validateUserPercentOwed: function () {
      let state = true;
      for (let i = 0; i < this.groupUsers.length; i++) {
        if (
          this.groupUsers[i].percentOwed ||
          this.groupUsers[i].percentOwed == 0 ||
          this.groupUsers[i].percentOwed == null ||
          this.groupUsers[i].percentOwed > 100
        ) {
          state = false;
        }
      }
      return state;
    },
    /**
     * Validation switch statement that is triggered on state changes in form
     * @param {*} type Type of form to validate
     */
    validateMe: function (type) {
      let state = false;
      let trans = this.transactionDetails;
      switch (type) {
        case "totalAmount":
          state =
            trans.transactionAmount != 0 && trans.transactionAmount != null;
          break;

        case "userAmountOwed":
          state = this.validateUserAmountOwed();
          break;

        case "userPercentOwed":
          state = this.validateUserPercentOwed();
          break;
        case "transactionName":
          state = trans.transactionName;
          break;

        default:
          state =
            trans.transactionAmount != 0 &&
            trans.transactionAmount != null &&
            this.userAmountOwed() &&
            this.userPercentOwed() &&
            trans.transactionName;
      }
      return state;
    },
  },
};
</script>

<style>
.createTransaction {
  text-align: right;
  margin: auto;
  width: 60%;
  /* border: 3px solid green; */
  padding: 10px;
}

@media only screen and (max-width: 768px) {
  .createTransaction {
    text-align: right;
    margin: auto;
    width: 90%;
    padding: 10px;
  }
  /* For mobile phones: */
  label,
  span {
    width: 60px;
    /* overflow: hidden; */
    display: inline-block;
    inline-size: min-content;
    /* text-overflow: ellipsis; */
    /* white-space: nowrap; */
  }
}
</style>
