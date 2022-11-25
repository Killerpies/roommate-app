<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">The Roommate App</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavmain"
        aria-controls="navbarNavmain"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavmain">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/roommateapp">RoomateApp</a>
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link" href="#">Pricing</a>
          </li> -->
        </ul>
      </div>
      <form class="d-flex">
        <button
          v-if="isAuthenticated"
          class="btn btn-outline-secondary mx-2"
          type="submit"
          @click="goToProfile"
        >
          Profile
        </button>
        <button
          v-if="!isAuthenticated"
          class="btn btn-outline-secondary"
          type="submit"
          @click="login"
        >
          Log in
        </button>
        <button
          v-if="isAuthenticated"
          class="btn btn-outline-secondary"
          type="submit"
          @click="logout"
        >
          Log out
        </button>
      </form>
    </div>
  </nav>
  <router-view />
</template>
<script>
import { useAuth0 } from "@auth0/auth0-vue";
import router from "@/router";

export default {
  name: "App",
  components: {},
  setup() {
    // console.log(process.env.NODE_ENV);
    if (
      location.protocol !== "https:" &&
      process.env.NODE_ENV !== "development"
    ) {
      location.protocol = "https:";
    }
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
      userID: null,
      allGroups: [],
      currentUserInfo: null,
    };
  },
  async mounted() {
    // if (!this.isAuthenticated) {
    //   router.push({ name: "home" });
    // }
    this.currentUserInfo = await this.$store.dispatch(
      "getCurrentUserInfo",
      this.getUserID
    );
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
  },
  methods: {
    goToProfile: function () {
      router.push({ name: "userprofile" });
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
html body {
  background-color: #daebf7;
}

@font-face {
  font-family: myFirstFont;
  src: url("../fonts/Raleway/Raleway-VariableFont_wght.ttf");
}

html div body {
  font-family: myFirstFont;
}
</style>
