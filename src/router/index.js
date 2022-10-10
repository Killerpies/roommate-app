import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import RoomateDashboard from "../views/RoomateDashboard.vue"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/roommateapp',
    name: 'roommateapp',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "roommateApp" */ '../views/RoomateAppViews/Roomate.vue')
  },
  {
    path: '/roommateapp/createGroup',
    name:'createGroup',
    component: () => import(/* webpackChunkName: "createGroup" */ '../views/RoomateAppViews/CreateGroup.vue')

  },
  {
    path: '/roommateapp/groupDashboard/:groupID',
    name:'groupDashboard',
    props: true,
    component: () => import(/* webpackChunkName: "groupDashboard" */ '../views/RoomateAppViews/GroupDashboard.vue')

  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
