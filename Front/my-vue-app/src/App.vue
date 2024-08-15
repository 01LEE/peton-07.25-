<template>
  <Header></Header>
  <router-view style="padding-top: 70px"></router-view>
  <ChatButton />
  <Footer></Footer>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import ChatButton from './components/ChatButton.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    ChatButton
  }
}
</script>

<style>

* {
  margin: 0;
  padding: 0;
  
}

a {
  text-decoration: none;
  color: var(--text-light-default);
}

li {
  list-style: none;
}

</style>
