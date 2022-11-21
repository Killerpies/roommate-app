<template>
  <div class="createJoinGroup" v-if="isAuthenticated">
    <h1 class="centerText">Your Profile</h1>
    <hr />
    <div class="formArea">
      <h2>Update Personal Information</h2>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon2">{{
          "First Name"
        }}</span>
        <input
          type="text"
          class="form-control"
          placeholder="Update First Name"
          aria-label="Update First Name"
          aria-describedby="basic-addon2"
          v-model="firstName"
          @keyup.enter="updatePersonalInfo('firstName')"
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          id="button-addon1"
          @click="updatePersonalInfo('firstName')"
        >
          Update First Name
        </button>
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon2">{{
          "Last Name"
        }}</span>
        <input
          type="text"
          class="form-control"
          placeholder="Update Last Name"
          aria-label="Update Last Name"
          aria-describedby="basic-addon2"
          v-model="lastName"
          @keyup.enter="updatePersonalInfo('lastName')"
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          id="button-addon1"
          @click="updatePersonalInfo('lastName')"
        >
          Update Last Name
        </button>
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon2">Email</span>
        <input
          type="text"
          class="form-control"
          placeholder="Update Email"
          aria-label="Update Email"
          aria-describedby="basic-addon2"
          v-model="email"
          @keyup.enter="updatePersonalInfo('email')"
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          id="button-addon1"
          @click="updatePersonalInfo('email')"
        >
          Update Email
        </button>
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon2">Phone #</span>
        <input
          type="tel"
          class="form-control"
          placeholder="Update Phone #"
          aria-label="Update Phone #"
          aria-describedby="basic-addon2"
          v-model="phoneNumber"
          @keyup.enter="updatePersonalInfo('phoneNumber')"
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          id="button-addon1"
          @click="updatePersonalInfo('phoneNumber')"
        >
          Update Phone #
        </button>
      </div>
    </div>

    <hr />
  </div>
</template>

<script>
import { useAuth0 } from "@auth0/auth0-vue";
// import router from "../router";

export default {
  name: "UserProfile",
  components: {},
  setup() {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
    return {
      login: () => {
        loginWithRedirect({
          appState: { target: `${window.location.pathname}` },
        });
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
      userID: null,
      allGroups: [],
      currentUserInfo: null,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    };
  },
  async mounted() {
    if (!this.isAuthenticated) {
      this.login();
    }
    this.currentUserInfo = await this.$store.dispatch(
      "getCurrentUserInfo",
      this.getUserID
    );
    this.setDefaultValues();
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
    getEmail() {
      return this.$store.getters.email;
    },
    getPhoneNumber() {
      return this.$store.getters.phoneNumber;
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
  },
  methods: {
    updatePersonalInfo: async function (type) {
      let payload = {
        userID: this.getUserID,
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        email: this.email,
      };
      console.log(payload);
      switch (type) {
        case "firstName":
          await this.$store.dispatch("updateFirstName", payload);
          break;
        case "lastName":
          await this.$store.dispatch("updateLastName", payload);
          break;
        case "email":
          await this.$store.dispatch("updateEmail", payload);
          break;
        case "phoneNumber":
          await this.$store.dispatch("updatePhoneNumber", payload);
          break;
      }
    },
    setDefaultValues: function () {
      this.firstName = this.getFirstName;
      this.lastName = this.getLastName;
      this.email = this.getEmail;
      this.phoneNumber = this.getPhoneNumber;
    },
  },
};
</script>
<style>
.formArea {
  margin: 10px;
  /* margin: auto; */
  text-align: left;
  width: 60%;
}
.centerText {
  text-align: center;
  width: 100%;
  /* border: 3px solid green; */
  /* padding: 10px; */
}
</style>
