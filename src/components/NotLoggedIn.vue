<template>
  <!-- <h1>Welcome to the Roommate App</h1> -->
  <body>
    <div class="container">
      <h1>Welcome to the Roommate App</h1>
      <img alt="Vue logo" src="../assets/friendsOnBeach.jpg" />
      <button v-if="!isAuthenticated" class="btn btn-warning" @click="login">
        Log in
      </button>
      <button
        v-if="isAuthenticated"
        class="btn btn-warning"
        @click="redirectToApp"
      >
        Go to app
      </button>
    </div>
  </body>
</template>

<script>
import { useAuth0 } from "@auth0/auth0-vue";

export default {
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
  methods: {
    /**
     * Routes user to the main page
     */
    redirectToApp: function () {
      this.$router.push({
        name: "roommateapp",
      });
    },
  },
};
</script>

<style scoped>
/* Make the image responsive */
.container img {
  width: 70%;
  /* height: 100%; */
  height: auto;
  filter: blur(1x);
  -webkit-filter: blur(1px);
}

/* Style the button and place it in the middle of the container/image */
.container .btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  /* background-color: #555; */
  /* color: white; */
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.container .btn:hover {
  background-color: black;
}
body {
  background-color: grey;
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
}
</style>
