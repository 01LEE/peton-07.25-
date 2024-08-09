<template>
  <header>
    <div class="h-inner">
      <div class="lf">
        <div class="logo">
          <router-link to="/"><img class="logo-img" src="../assets/images/logo/logo.svg" alt="Logo"></router-link>
        </div>
        <ul class="nav">
          <li class="Heading2-SemiBold" :class="{ 'NavActive': isCommunityPath }">
            <router-link :class="{ 'active': isCommunityPath }" to="/Community/Peton/All">커뮤니티</router-link>
          </li>
          <li class="Heading2-SemiBold" :class="{ 'activeLi': isEncyclopediaPath }">
            <router-link :class="{ 'active': isEncyclopediaPath }" to="/Encyclopedia">펫 백과</router-link>
          </li>
        </ul>
      </div>
      <div class="rt">
        <div class="login"><router-link to="/login" class="loginBtn Body1-Medium">로그인</router-link></div>
        <div class="signup"><router-link to="/signup" class="signupBtn Body1-Medium">회원가입</router-link></div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    isCommunityPath() {
      return this.$route.path.includes('/Community');
    },
    isEncyclopediaPath() {
      return this.$route.path.includes('/Encyclopedia');
    }
  }
}
</script>

<style>
header {
  z-index: 2;
  /* backdrop-filter: ; */
  background-color: var(--neutral-100);
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  line-height: 70px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border-light-default);
}

.h-inner {
  width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-img {
  display: block;
}

.nav {
  display: inline-flex;
  text-align: center;
  /* gap: 28px; */
}

.nav>li {
  padding: 0px 30px;
  line-height: 70px;
  position: relative;
}

.active {
  color: var(--primary-normal);
}

.activeLi::after {
  transition: all 0.5s;
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background-color: var(--primary-normal);
}

.lf {
  display: flex;
  gap: 70px;
}

.rt {
  display: flex;
  gap: 10px;
}

.loginBtn,
.signupBtn {
  border-radius: 8px;
  padding: 8px 20px;
}

.loginBtn {
  color: var(--text-light-default);
  border: 1px solid var(--border-light-default);
  background-color: var(--neutral-100);
}

.signupBtn {
  color: var(--text-light-reverse);
  background-color: var(--primary-normal);
}
</style>
