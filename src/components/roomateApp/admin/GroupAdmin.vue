<template>
  <div v-if="dataReady">
    <h1>Group Settings</h1>
    <hr />
    <div>
      <section>
        <h4>Change Group Name</h4>
        <input type="text" placeholder="Enter New Name" v-model="groupName" />
        <button class="btn btn-warning" @click="changeGroupName">
          Change Group Name
        </button>
        <p>Group Name: {{ groupInfo.groupname }}</p>
        <h4>Add/Invite Group Members</h4>
        <div>
          <input type="text" placeholder="Enter ID" v-model="inviteUserID" />
          <button class="btn btn-warning" @click="inviteMemberNoEmail">
            Invite Member With ID
          </button>
        </div>
        <div class="mt-2">
          <input
            type="text"
            placeholder="Enter User Email"
            v-model="inviteUserEmail"
          />
          <button class="btn btn-danger" @click="inviteMemberWithEmail()">
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
    await this.getCurrentUserInfo();
    await this.getGroupInfo();
    await this.getGroupContactInfo();
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
    getGroupName() {
      return this.groupInfo.groupname;
    },
    isOwner() {
      return this.groupInfo.groupowneruserid == this.getUserID;
    },
  },
  methods: {
    changeGroupName: async function () {
      let payload = {
        groupName: this.groupName,
        groupID: this.groupID,
      };

      let url = `/api/alterGroup/changeGroupName`;
      await axios.post(url, payload);
      await this.getGroupInfo();
    },
    removeUserFromGroup: async function (index) {
      let temp = this.groupUsers.splice(index, 1)[0];
      let payload = temp;
      payload.groupID = this.groupID;
      let url = `/api/userGroupMembers/removeMember`;
      await axios.post(url, payload);
    },
    inviteMemberWithEmail: async function () {
      let url = `/api/send-email`;
      let subject = "Roommate-app: New Group invite";
      let body = `${this.getFirstName} ${this.getLastName} invited you too: ${this.getGroupName}\n`;
      body += `Click the link below to join:`;
      let recipient = this.inviteUserEmail;
      let payload = {
        recipient: recipient,
        subject: subject,
        body: body,
      };
      await axios.post(url, payload);
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
    /**
     * This function takes a users info given from their account and adds it to the database
     * If the user already exists then it will just pull the old info
     * If the user does not exist then it adds them to the database
     */
    getCurrentUserInfo: async function () {
      // If user does not exist then will create a user entry
      let payload = {
        userid: this.getUserID,
        firstname: this.getFirstName,
        lastname: this.getLastName,
        phonenumber: null,
        email: null,
      };
      let url = `/api/userinfo/create`;
      await axios.post(url, payload);

      // get user entry from database (Either the brand new one or one thats already created)
      url = `/api/userInfo/${this.getUserID}`;
      let response = await axios.get(url);
      this.currentUserInfo = response.data[0];
    },
    getGroupContactInfo: async function () {
      for (let i = 0; i < this.groupUsers.length; i++) {
        let url = `/api/userInfo/${this.groupUsers[i].userid}`;
        let response = await axios.get(url);
        // console.log(response.data);
        let temp = response.data[0];
        this.groupContactInfo.push(temp);
      }
    },
    /**
     * Makes call to server getting group name from server
     * Then makes another call to server getting all users attached to the group
     */
    getGroupInfo: async function () {
      // gets groupID, groupname, groupowner
      let url = `/api/groups/${this.groupID}`;
      let result = await axios.get(url);
      this.groupInfo = result.data[0];
      // gets members of the group
      url = `/api/userGroupMembers/${this.groupID}`;
      let response = await axios.get(url);
      for (let i = 0; i < response.data.length; i++) {
        let tempUser = {
          userid: response.data[i].userid,
          firstName: response.data[i].userfirstname,
          lastName: response.data[i].userlastname,
        };
        this.groupUsers.push(tempUser);
      }
    },
  },
};
</script>

<style>
section {
  text-align: left;
  margin: 10px;
}
</style>
