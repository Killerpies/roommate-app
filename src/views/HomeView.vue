<template>
  <div class="bg"></div>
  <!-- <div class="bg">
    <img src="../assets/friendsOnBeach.jpg" />
  </div> -->
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
  methods: {},
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
.bg {
  background: url("../assets/friendsOnBeach.jpg") no-repeat center center fixed;
  background-size: cover;
  min-height: auto;
  overflow: hidden;
  width: 100%;
  height: 92.59vh;
  position: absolute;
  right: 0;
}
body {
  overflow-y: hidden; /* Hide vertical scrollbar */
  overflow-x: hidden; /* Hide horizontal scrollbar */
}
</style>
