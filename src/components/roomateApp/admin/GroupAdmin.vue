<template>
  <div v-if="dataReady">
    <h1>Group Settings</h1>
    <hr />
    <div>
      <section>
        <h4>Change Group Name</h4>
        <div class="input-group mt-2 mb-4 formArea">
          <!-- <span class="input-group-text" id="basic-addon2">Group Name</span> -->
          <input
            type="tel"
            class="form-control"
            placeholder="Enter User Email"
            v-model="groupName"
            @keyup.enter="changeGroupName"
          />
          <button
            class="btn btn-outline-secondary buttonSize"
            type="button"
            id="button-addon1"
            @click="changeGroupName"
          >
            Change Group Name
          </button>
        </div>
        <h4>Add/Invite Group Members</h4>
        <div class="input-group mb-3 formArea">
          <!-- <span class="input-group-text" id="basic-addon2">ID</span> -->
          <input
            type="tel"
            class="form-control"
            placeholder="Enter User ID"
            v-model="inviteUserID"
            @keyup.enter="inviteMemberNoEmail"
          />
          <button
            class="btn btn-outline-secondary buttonSize"
            type="button"
            id="button-addon1"
            @click="inviteMemberNoEmail"
          >
            Invite Member With ID
          </button>
        </div>
        <div class="input-group mb-4 formArea">
          <!-- <span class="input-group-text" id="basic-addon2">Email</span> -->
          <input
            type="tel"
            class="form-control"
            placeholder="Enter User Email"
            v-model="inviteUserEmail"
            @keyup.enter="inviteMemberWithEmail()"
          />
          <button
            class="btn btn-outline-secondary buttonSize"
            type="button"
            id="button-addon1"
            @click="inviteMemberWithEmail()"
          >
            Send Email Invite
          </button>
        </div>
        <hr />
      </section>
      <section v-if="isOwner">
        <h2>Owner Settings</h2>
        <div v-for="(item, index) in groupUsers" :key="index" class="row mt-2">
          <div v-if="item.userid != groupInfo.groupowneruserid" class="col">
            <button class="btn btn-danger" @click="removeUserFromGroup(index)">
              Remove from group
            </button>
            {{ item.firstName }} {{ item.lastName }}
          </div>
        </div>
        <div>
          <br />
          <button class="btn btn-danger" @click="deleteGroup">
            Permanently delete group
          </button>
        </div>

        <hr />
      </section>
      <section>
        <h2>My Groups Contact Info</h2>
        <p v-for="(item, index) in groupContactInfo" :key="index">
          First Name: {{ item.firstname }} <br />
          Last Name: {{ item.lastname }} <br />
          Phone Number: {{ item.phonenumber }}<br />
          Email: {{ item.email }}<br />
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";
// import financialDashboard from "../../components/roomateApp/financial/FinancialDashboard.vue";

export default {
  name: "adminDashboard",
  props: {
    groupID: String,
    // likes: Number
  },
  components: {
    // financialDashboard,
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
      inviteUserID: null,
      groupInfo: null,
      groupUsers: [],
      currentUserInfo: null,
      groupContactInfo: [],
      groupName: "",
      inviteUserEmail: "",
    };
  },
  async mounted() {
    if (!this.isAuthenticated) {
      router.push({ name: "home" });
    }
    this.currentUserInfo = this.getUserInfo;
    this.groupInfo = this.getGroupInfo;
    this.groupUsers = this.getGroupUsers;
    this.groupContactInfo = this.getGroupContactInfo;
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
    getUserInfo() {
      return this.$store.getters.userInfo;
    },
    getGroupContactInfo() {
      return this.$store.getters.groupContactInfo;
    },
    getGroupName() {
      return this.$store.getters.groupname;
    },
    isOwner() {
      return this.groupInfo.groupowneruserid == this.getUserID;
    },
  },
  methods: {
    deleteGroup: async function () {
      if (
        confirm(
          "WARNING: This will permanently delete this group. Are you sure?"
        )
      ) {
        let payload = {
          groupID: this.groupID,
        };
        await this.$store.dispatch("deleteGroup", payload);
        router.push({ name: "home" });
      }
    },
    changeGroupName: async function () {
      let payload = {
        groupName: this.groupName,
        groupID: this.groupID,
      };
      await this.$store.dispatch("changeGroupName", payload);
    },
    removeUserFromGroup: async function (index) {
      let temp = this.groupUsers.splice(index, 1)[0];
      let payload = temp;
      payload.groupID = this.groupID;
      payload.groupUsers = this.groupUsers;
      await this.$store.dispatch("removeUserFromGroup", payload);
    },
    inviteMemberWithEmail: async function () {
      let response = await this.$store.dispatch(
        "createGroupInvite",
        this.groupID
      );
      // console.log(response);
      let inviteID = response;
      let subject = "Roommate-app: New Group invite";
      let body = `${this.getFirstName} ${this.getLastName} invited you too: ${this.getGroupName}\n`;
      body += `Click the link below to join:\n`;
      body += `${window.location.origin}/roommateapp/joinGroup/${inviteID}`;
      let recipient = this.inviteUserEmail;
      let payload = {
        recipient: recipient,
        subject: subject,
        body: body,
      };
      await this.$store.dispatch("inviteMemberWithEmail", payload);
      this.inviteUserEmail = "";
    },
    /**
     * Takes userID of person who is meant to be invited
     * Finds their info in database
     * Then adds them to current group in groupUsers table
     */
    inviteMemberNoEmail: async function () {
      let url = `/api/userinfo/${this.inviteUserID}`;
      let response = await axios.get(url);
      if (response.data.length > 0) {
        let payload = {
          userID: this.inviteUserID,
          newGroupID: this.groupID,
          firstName: response.data[0].firstname,
          lastName: response.data[0].lastname,
        };
        url = `/api/groups/join`;
        await axios.post(url, payload);
        alert(
          `Invited: ${response.data[0].firstname} ${response.data[0].lastname}`
        );
      } else {
        alert(`Could Not find user: ${this.inviteUserID}`);
      }
      this.inviteUserID = "";
    },
  },
};
</script>

<style scoped>
section {
  text-align: left !important;
  margin: 10px !important;
}

.formArea {
  /* margin: 10px; */
  /* margin: auto; */
  text-align: left !important;
  width: 50% !important;
}

.centerText {
  text-align: center !important;
  width: 100% !important;
  /* border: 3px solid green; */
  /* padding: 10px; */
}

@media only screen and (max-width: 768px) {
  .formArea {
    text-align: left !important;
    width: auto !important;
  }
  .buttonSize {
    width: 40% !important;
  }
  span {
    width: 20% !important;
  }
}
</style>
