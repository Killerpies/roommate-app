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
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
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

export default {
  name: "App",
  components: {},
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
