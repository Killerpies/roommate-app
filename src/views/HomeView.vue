<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
  <div>
    <button @click="login">Log in</button>
  </div>
  <div>
    <button @click="logout">Log out</button>
  </div>
  <div>
    <pre v-if="isAuthenticated">
        <code>{{ user }}</code>
        <code>{{user.id}}</code>
      </pre>
  </div>
  <button @click="printInfo">printInfo</button>
  <h1>HERE IS WHERE LIST IS</h1>
  <div v-for="(item, index) in catnames" v-bind:key="index">
    <li>{{ item.name }}</li>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
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
  mounted() {
    this.getcat();
  },
  methods: {
    getcat: async function () {
      try {
        let url = "/cats";

        let data = await axios.get(url);
        this.catnames = data.data;
      } catch (error) {
        console.error(error);
      }
    },
    printInfo: function () {
      if (this.isAuthenticated) {
        // console.log(this.user)
        // console.log(this.user.user_id)
      }
    },
  },
};
</script>
