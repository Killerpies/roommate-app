<template>
  <!-- <div class="goBack">
      <button class="btn btn-warning" @click="backToLastPage">
        Back to Last Page
      </button>
    </div> -->
  <div>
    <h1>Your Groups Chores</h1>
  </div>
  <div class="row" id="selectionArea">
    <div class="col" v-if="dataReady">
      <!-- <label>Choose another List</label> -->
      <!-- <select
          id="selectedGroup"
          class="form-select"
          aria-label="Default select example"
        >
          <option
            v-for="(item, index) in groupInfo"
            :key="index"
            v-bind:value="item.groupid"
          >
            {{ item.groupname }}
          </option>
        </select> -->
      <!-- <button class="btn btn-warning" @click="viewDebt">View My Debt</button> -->
    </div>
    <div class="col" v-if="allChoresList.length < 1">
      <button class="btn btn-warning" @click="createList">
        Create New List
      </button>
    </div>
  </div>
  <div class="input-group mb-3" v-if="dataReady">
    <input
      type="text"
      v-model="newItem"
      @keyup.enter="addItem"
      placeholder="Add an Item"
      class="form-control"
    />
    <button class="btn btn-warning" @click="addItem">Add Item</button>
  </div>
  <div class="mainPage" v-if="dataReady">
    <div v-if="dataReady">
      <hr />
      <h2>Current List</h2>
      <table class="table table-hover table-striped">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Remove Item</th>
            <th scope="col">Check Off Item</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in currentListContents" :key="index">
            <td>{{ item.itemName }}</td>
            <td>
              <a
                class="nav-link"
                style="cursor: pointer; text-decoration: underline"
                @click="archiveItem(index)"
                >Remove Item</a
              >
            </td>
            <td>
              <a
                class="nav-link"
                style="cursor: pointer; text-decoration: underline"
                v-bind:style="!item.activeItem ? 'color: red' : ''"
                @click="moveItem(index)"
                >Check Off Item</a
              >
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <h2>Archived Items</h2>
      <table class="table table-hover table-striped">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Remove Item</th>
            <th scope="col">Check Off Item</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in currentArchivedItems" :key="index">
            <td>{{ item.itemName }}</td>
            <td>
              <a
                class="nav-link"
                style="cursor: pointer; text-decoration: underline"
                @click="removeItem(index)"
                >Permanantly Remove Item</a
              >
            </td>
            <td>
              <a
                class="nav-link"
                style="cursor: pointer; text-decoration: underline"
                v-bind:style="!item.activeItem ? 'color: red' : ''"
                @click="reAddItem(index)"
                >Re-add item</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";

export default {
  name: "choreList",
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
      dataReady: false,
      groupInfo: null,
      groupUsers: [],
      currentChoreList: [],
      currentListContents: [],
      currentArchivedItems: [],
      allChoresList: [],
      newItem: "",
    };
  },
  async mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }
    this.groupInfo = this.getGroupInfo;
    this.groupUsers = this.getGroupUsers;
    await this.getChoresLists();
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
    removeItem: async function (index) {
      this.currentArchivedItems.splice(index, 1);
      await this.updateList();
    },
    archiveItem: async function (index) {
      let archivedItem = this.currentListContents.splice(index, 1)[0];
      this.currentArchivedItems.push(archivedItem);
      await this.updateList();
    },
    reAddItem: async function (index) {
      let item = this.currentArchivedItems.splice(index, 1)[0];
      this.currentListContents.push(item);
      await this.updateList();
    },
    addItem: async function () {
      if (this.newItem == "") {
        return;
      }
      let temp = {
        itemName: this.newItem,
        activeItem: true,
      };
      this.currentListContents.unshift(temp);
      this.newItem = "";
      await this.updateList();
    },
    updateList: async function () {
      let url = `/api/specificchorelist/${this.currentChoreList.chorelistid}`;
      let currentlist = JSON.stringify(this.currentListContents);
      let archivedList = JSON.stringify(this.currentArchivedItems);
      let payload = {
        listContents: currentlist,
        archived: archivedList,
      };
      await axios.post(url, payload);
    },
    getChoresLists: async function () {
      let url = `/api/chorelist/${this.groupID}`;
      let response = await axios.get(url);
      this.allChoresList = response.data;
      this.currentChoreList = response.data[0];
      this.currentListContents = [];
      this.currentArchivedItems = [];
      if (this.currentChoreList.listcontents) {
        this.currentListContents = this.currentChoreList.listcontents;
      }
      if (this.currentChoreList.archived) {
        this.currentArchivedItems = this.currentChoreList.archived;
      }
    },
    moveItem: async function (index) {
      let temp = this.currentListContents.splice(index, 1)[0];
      temp.activeItem = !temp.activeItem;
      if (!temp.activeItem) {
        this.currentListContents.push(temp);
      }
      if (temp.activeItem) {
        this.currentListContents.unshift(temp);
      }
      await this.updateList();
    },
    createList: function () {
      router.push({
        name: "createChoreList",
        params: { groupID: this.groupID },
      });
    },
    /**
     * Routes user back to last viewed component
     */
    backToLastPage: function () {
      router.back();
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
.mainPage {
  margin: 30px;
  text-align: center;
  padding-right: 10px;
}
.goBack {
  margin: 10px;
  text-align: right;
  padding-right: 10px;
}
#selectionArea {
  margin: auto;
  text-align: center;
}

@media only screen and (max-width: 768px) {
  .mainPage {
    margin: auto;
    text-align: center;
    padding-right: 10px;
  }
  td,
  th {
    white-space: normal; /* Only needed when it's set differntly somewhere else */
    word-wrap: break-word;
  }
  table {
    word-break: break-word;
  }

  .properMargins {
    display: flex;
  }
}
</style>
