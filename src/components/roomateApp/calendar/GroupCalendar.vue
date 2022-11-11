<template>
  <!-- <div v-if="dataReady" class="createTransaction">
    <button class="btn btn-warning" @click="back">Back to Dashboard</button>
    <h1 style="text-align: center">Group Calendar</h1>
  </div> -->
  <div class="box">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  name: "groupCalendar",
  props: {
    groupID: String,
  },
  components: {
    FullCalendar,
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
      allEvents: [],
      events: [],
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        // eventMouseEnter: this.handlePopup,
        events: [],
      },
    };
  },
  async mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }
    await this.getGroupInfo();
    await this.getEvents();
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
    getEvents: async function () {
      let url = `/api/groupcalendar/eventsforGroup/${this.groupID}`;
      // let payload = {
      //   groupID: this.groupID,
      //   test: "dsfsfdsf",
      // };
      // console.log(payload);
      let response = await axios.get(url);
      let allEvents = response.data;
      console.log(allEvents);
      for (let i = 0; i < allEvents.length; i++) {
        let temp = {
          id: allEvents[i].eventid,
          title: allEvents[i].title,
          start: allEvents[i].eventdatestart,
          end: allEvents[i].eventdateend,
          allDay: true,
        };
        this.events.push(temp);
      }
      this.calendarOptions.events = this.events;
    },
    handleEventClick: function (arg) {
      // console.log(arg.event);
      router.push({
        name: "createEvent",
        params: {
          mode: "edit",
          eventID: arg.event.id,
          groupID: this.groupID,
          eventDateStart: this.formatDate(arg.event.startStr),
          eventDateEnd:
            arg.event.endStr != ""
              ? this.formatDate(arg.event.endStr)
              : this.formatDate(arg.event.startStr),
        },
      });
    },

    // handlePopup: function (info) {
    //   console.log(info);
    // },
    handleDateClick: function (arg) {
      // alert("date click! " + arg.dateStr);
      router.push({
        name: "createEvent",
        params: {
          mode: "create",
          groupID: this.groupID,
          eventDateStart: arg.dateStr,
          eventDateEnd: arg.dateStr,
        },
      });
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
  },
};
</script>

<style>
.fc-event:hover {
  border-color: #1c7d87 !important;
}
.fc-event:hover .fc-content {
  color: #1c7d87 !important;
}
.fc-list-item:hover td {
  background-color: red !important;
}
.fc-daygrid-day:hover {
  background-color: #cacecf;
}
.box {
  background-color: white !important;
}
</style>
