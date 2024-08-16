<template>
  <Header></Header>
  <router-view style="padding-top: 70px"></router-view>
  <Footer></Footer>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';


export default {
  name: 'App',
  components: {
    Header,
    Footer,
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
