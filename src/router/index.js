import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
// import RoomateDashboard from "../views/RoomateDashboard.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/roommateapp",
    name: "roommateapp",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "roommateApp" */ "../views/RoomateAppViews/Roomate.vue"
      ),
  },
  {
    path: "/roommateapp/createGroup",
    name: "createGroup",
    component: () =>
      import(
        /* webpackChunkName: "createGroup" */ "../views/RoomateAppViews/CreateGroup.vue"
      ),
  },
  {
    path: "/roommateapp/groupDashboard/:groupID",
    name: "groupDashboard",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "groupDashboard" */ "../views/RoomateAppViews/GroupDashboard.vue"
      ),
  },
  {
    path: "/roommateapp/createTransaction/:groupID",
    name: "createTransaction",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "createTransaction" */ "../components/roomateApp/financial/CreateTransaction.vue"
      ),
  },
  {
    path: "/roommateapp/viewTransaction/:groupID/:transactionID",
    name: "viewTransaction",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "viewTransaction" */ "../components/roomateApp/financial/ViewTransaction.vue"
      ),
  },
  {
    path: "/roommateapp/viewDebt/:groupID",
    name: "viewDebt",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "viewDebt" */ "../components/roomateApp/financial/ViewDebt.vue"
      ),
  },
  {
    path: "/roommateapp/grocerylist/:groupID",
    name: "groceryList",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "groceryList" */ "../components/roomateApp/grocery/GroceryList.vue"
      ),
  },
  {
    path: "/roommateapp/createGroceryList/:groupID",
    name: "createGroceryList",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "createGroceryList" */ "../components/roomateApp/grocery/CreateGroceryList.vue"
      ),
  },
  {
    path: "/roommateapp/chorelist/:groupID",
    name: "choreList",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "chorelist" */ "../components/roomateApp/chores/ChoreList.vue"
      ),
  },
  {
    path: "/roommateapp/createGroceryList/:groupID",
    name: "createChoreList",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "createChoreList" */ "../components/roomateApp/chores/CreateChoreList.vue"
      ),
  },
  {
    path: "/roommateapp/calendar/:groupID",
    name: "groupcalendar",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "groupcalendar" */ "../components/roomateApp/calendar/GroupCalendar.vue"
      ),
  },
  {
    path: "/roommateapp/createEvent/:mode/:eventID?/:groupID/:eventDateStart/:eventDateEnd",
    name: "createEvent",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "createEvent" */ "../components/roomateApp/calendar/CreateEvent.vue"
      ),
  },
  {
    path: "/roommateapp/joinGroup/:inviteID",
    name: "joinGroup",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "joinGroup" */ "../components/roomateApp/joingroup/JoinGroup.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
