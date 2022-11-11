<template>
  <div v-if="groupUsers.length > 0" class="createTransaction">
    <button class="btn btn-warning" @click="back">Back</button>
    <h1 v-if="mode == 'create'" style="text-align: center">Create Event</h1>
    <h1 v-else style="text-align: center">Edit Event</h1>
    <form v-on:submit.prevent="createOrEditEvent">
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">Title</span>
        <input
          v-model="eventDetails.title"
          type="text"
          class="form-control"
          placeholder="Enter a name for transaction"
          aria-label="Username"
          aria-describedby="basic-addon1"
          :state="validateMe('title')"
          required
        />
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">Start</span>
        <input
          v-model="eventDetails.eventDateStart"
          type="date"
          class="form-control"
          placeholder="Enter a name for transaction"
          aria-label="Username"
          aria-describedby="basic-addon1"
          :state="validateMe('eventDateStart')"
          required
        />
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">End</span>
        <input
          v-model="eventDetails.eventDateEnd"
          type="date"
          class="form-control"
          placeholder="Enter a name for transaction"
          aria-label="Username"
          aria-describedby="basic-addon1"
          :state="validateMe('eventDateEnd')"
          required
        />
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text">Description</span>
        <textarea
          v-model="eventDetails.eventDescription"
          class="form-control"
          aria-label="With textarea"
          placeholder="Enter a description"
        ></textarea>
      </div>
      <button v-if="mode == 'create'" type="submit" class="btn btn-warning">
        Create Event
      </button>
      <button v-else type="submit" class="btn btn-warning">Update Event</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";

export default {
  name: "createEvent",
  props: {
    title: String,
    mode: {
      type: String,
      default: "create",
    },
    eventID: {
      type: String,
      default: null,
    },
    groupID: String,
    eventDateStart: String,
    eventDateEnd: String,
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
      eventDetails: {
        title: "",
        eventDateStart: "",
        eventDateEnd: "",
        eventDescription: "",
      },
      groupInfo: null,
      groupUsers: [],
      dataReady: false,
    };
  },
  // {{ this.eventID }}
  async mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }
    this.getGroupInfo();
    if (this.eventID && this.mode == "edit") {
      await this.getEvent();
    } else {
      this.eventDetails.eventDateStart = this.eventDateStart;
      this.eventDetails.eventDateEnd = this.eventDateEnd;
    }
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
    getEvent: async function () {
      let url = `/api/groupCalendar/singleEvent/${this.eventID}`;
      let response = await axios.get(url);
      let event = response.data[0];
      this.eventDetails.title = event.title;
      this.eventDetails.eventDateEnd = this.formatDate(event.eventdateend);
      this.eventDetails.eventDateStart = this.formatDate(event.eventdatestart);
      this.eventDetails.eventDescription = event.eventdescription;
    },
    createOrEditEvent: async function (event) {
      event.preventDefault;
      if (this.mode == "create") {
        await this.createEvent(event);
      } else {
        await this.editEvent(event);
      }
      router.back();
    },
    editEvent: async function (event) {
      event.preventDefault;
      let url = `/api/groupCalendar/updateEvent`;
      let payload = this.eventDetails;
      payload.groupID = this.groupID;
      payload.eventID = this.eventID;
      await axios.post(url, payload);
    },
    createEvent: async function (event) {
      event.preventDefault;
      let url = `/api/groupcalendar/create`;
      let payload = this.eventDetails;
      payload.groupID = this.groupID;
      await axios.post(url, payload);
    },
    back: function () {
      router.back();
    },
    /**
     *
     * Converts string date to proper format (M/D/Y)
     * @param {*} date string date
     */
    formatDate: function (date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
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
      let end = this.eventDetails.eventDateEnd;
      let start = this.eventDetails.eventDateStart;
      let title = this.eventDetails.title;
      switch (type) {
        case "title":
          state = title != "" && title != null;
          break;

        case "eventDateStart":
          state = start != "" && start != null;
          break;

        case "eventDateEnd":
          state = end != "" && end != null;
          break;

        default:
          state =
            title != "" &&
            title != null &&
            start != "" &&
            start != null &&
            end != "" &&
            end != null;
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
