<template>
  <div class="bg"></div>
  <div class="buttonarea">
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
</template>

<script>
// @ is an alias to /src
// import NotLoggedIn from "@/components/NotLoggedIn.vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default {
  name: "HomeView",
  components: {
    // Homepage,
    // NotLoggedIn,
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
    return {};
  },
  mounted() {},
  methods: {
    redirectToApp: function () {
      this.$router.push({
        name: "roommateapp",
      });
    },
  },
};
</script>
<style>
/* .bg {
  height: 100%;
  width: 100%;
  background: url("../assets/friendsOnBeach.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
} */
.buttonarea .btn {
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

.bg .btn:hover {
  background-color: black;
}
.bg {
  background: url("../assets/friendsOnBeach.jpg") no-repeat center center fixed;
  background-size: cover;
  min-height: auto;
  overflow: hidden;
  width: 100%;
  height: 92.59vh;
  position: absolute;
  right: 0;
  filter: blur(1x);
  -webkit-filter: blur(1px);
}
.bg button {
  margin: auto;
}
body {
  overflow-y: hidden; /* Hide vertical scrollbar */
  overflow-x: hidden; /* Hide horizontal scrollbar */
}
</style>
