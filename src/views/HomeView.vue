<template>
  <div class="home">
    <NotLoggedIn></NotLoggedIn>
  </div>
</template>

<script>
// @ is an alias to /src
import NotLoggedIn from "@/components/NotLoggedIn.vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default {
  name: "HomeView",
  components: {
    // Homepage,
    NotLoggedIn,
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
      catnames: [],
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style>
/* template {
  background-color: #a0a0a0;
} */
</style>
