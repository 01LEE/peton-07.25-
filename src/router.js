import { createWebHistory, createRouter } from "vue-router";
import Main from './Pages/Main.vue'
import Community from './Pages/Community.vue'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import CommAll from './components/CommunityComponents/CommAll.vue';
import AboptAll from './components/AdoptionComponents/AdoptAll.vue'
import GatheringAll from './components/GatheringComponents/CommGathering.vue';
// post
import PostCreate from '/src/components/Posts/PostCreate.vue';
import PostDetail from '/src/components/Posts/PostDetail.vue';
import PostEdit from '/src/components/Posts/PostEdit.vue';

const routes = [
  {
    path: "/",
    component: Main,

  },
  {
    path: "/Community",
    component: Community,
    children: [
      {
        path: "Peton/All",
        name:"PostList",
        component: CommAll,
      },
      {
        path: "Peton/Post/Create",
        name: "PostCreate",
        component: PostCreate,
      },
      {
        path: "Peton/Post/:id",
        name: "PostDetail",
        component: PostDetail,
      },
      {
        path: "Peton/Post/:id/Edit",
        name: "PostEdit",
        component: PostEdit,
      },
      {
        path: "Gathering/All",
        component: GatheringAll,
      },
      {
        path: "Aboption/All",
        component: AboptAll,
      },
      {
        path: "Aboption/All",
        component: AboptAll,
      },
    ]
  },
  {
    path: "/Login",
    component: Login,
  },
  {
    path: "/Signup",
    component: Signup,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 