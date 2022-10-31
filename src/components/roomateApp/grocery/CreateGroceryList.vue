<template>
  <div v-if="dataReady" class="createTransaction">
    <button class="btn btn-warning" @click="back">Back to GroceryLists</button>
    <h1 style="text-align: center">Create a Grocery List</h1>
    <form v-on:submit.prevent="createList">
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">List Name</span>
        <input
          v-model="listName"
          type="text"
          class="form-control"
          placeholder="Enter a name for the list"
          aria-label="Username"
          aria-describedby="basic-addon1"
          :state="validateMe('listName')"
          required
        />
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">Add Item</span>
        <input
          v-model="newItem"
          type="text"
          class="form-control"
          placeholder="Enter an item"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
        <button class="btn btn-success" type="button" @click="addItem">
          Add Item
        </button>
      </div>
      <button class="btn btn-warning" type="submit">Create List</button>
    </form>
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th scope="col">Item</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in listContents"
          :key="index"
          style="cursor: pointer"
        >
          <td>{{ item.itemName }}</td>
          <td>
            <a
              class="nav-link"
              style="cursor: pointer; text-decoration: underline"
              @click="removeItem(index)"
              >Remove Item</a
            >
          </td>
        </tr>
      </tbody>
    </table>
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
      newItem: "",
      listName: "",
      listContents: [],
      dataReady: false,
      groupInfo: null,
      groupUsers: [],
    };
  },
  mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }
    this.getGroupInfo();
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
    createList: async function (event) {
      event.preventDefault();
      let url = "/api/grocerylist/create";
      let list = JSON.stringify(this.listContents);
      let payload = {
        groupID: this.groupID,
        listName: this.listName,
        listContents: list,
        activeList: true,
      };
      await axios.post(url, payload);
      router.back();
    },
    removeItem: function (index) {
      this.listContents.splice(index, 1);
    },
    addItem: function () {
      if (this.newItem == "") {
        return;
      }
      let temp = {
        itemName: this.newItem,
        activeItem: true,
      };
      this.listContents.push(temp);
      this.newItem = "";
    },
    /**
     * Routes back to the last page visited
     * Should be financial
     */
    back: function () {
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
        temp.percentOwed = null;
        temp.amountOwed = null;
        this.groupUsers.push(temp);
      }
      //   this.groupUsers = response.data;
    },
    /**
     * Validation switch statement that is triggered on state changes in form
     * @param {*} type Type of form to validate
     */
    validateMe: function (type) {
      let state = false;
      switch (type) {
        case "listName":
          state = this.listName != "";
          break;

        default:
          state = this.listName != "";
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
