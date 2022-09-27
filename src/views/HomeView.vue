<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
  <h1>HERE IS WHERE LIST IS</h1>
  <div v-for="(item, index) in catnames" v-bind:key="index">
  <li>{{item.name}}</li>
</div>

</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data() {
    return{
      catnames: []
    }
  },
  mounted(){
    this.getcat()
    console.log(window.location.origin)
  },
  methods:{
    getcat: async function(){
    try {
      let url = window.location.origin + '/cats'
        let data =  await axios.get(url)
        // console.log('data')
        // console.log(data.data)
        this.catnames = data.data
    } catch (error) {
        console.error(error)
    }
    
    }
  }
}
</script>
