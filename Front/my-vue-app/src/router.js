import { createWebHistory, createRouter } from "vue-router";
import Main from './Pages/Main.vue'
import Community from './Pages/Community.vue'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import CommAll from './components/CommunityComponents/CommAll.vue';
import AboptAll from './components/AdoptionComponents/AdoptAll.vue'
import GatheringAll from './components/GatheringComponents/CommGathering.vue';
import Chatlist from "./components/Chatlist.vue";
// post
import PostCreate from '/src/components/Posts/PostCreate.vue';
import PostDetail from '/src/components/Posts/PostDetail.vue';
import PostEdit from '/src/components/Posts/PostEdit.vue';
//Error
import ErrorPage from '/src/Pages/ErrorPage.vue';
//MyPage
import MyPage from '@/Pages/MyPage.vue';
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
        // component: GatheringAll,
        component: ErrorPage,
      },
      {
        path: "Aboption/All",
        // component: AboptAll,
        component: ErrorPage,
      },
      {
        path: "Aboption/All",
        // component: AboptAll,
        component: ErrorPage,
      },
    ]
  },
  {
    path: "/Encyclopedia",
    component: ErrorPage,
  },
  {
    path: "/Login",
    component: Login,
  },
  {
    path: "/Signup",
    component: Signup,
  },
  {
    path: "/MyPage",
    component: MyPage,
  },
  {
    path: "/404",
    component: ErrorPage,
  },
  {
    path: "/chatlist",
    name: "Chatlist",
    component: Chatlist
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 