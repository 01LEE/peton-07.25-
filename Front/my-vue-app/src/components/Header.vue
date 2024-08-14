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
          <li class="Heading2-SemiBold" :class="{ 'activeLi': isChatlistPath }">
            <router-link :class="{ 'active': isChatlistPath }" to="/chatlist">채팅방</router-link>
          </li>
        </ul>
      </div>
      <div class="rt">
        <div>
          <div class="login"><router-link to="/login" class="loginBtn Body1-Medium">로그인</router-link></div>
          <div class="signup"><router-link to="/signup" class="signupBtn Body1-Medium">회원가입</router-link></div>
    
    
          <div class="logout"><button @click="logout" class="loginBtn Body1-Medium">로그아웃</button></div>
          <div class="myPage"><router-link to="/Mypage" class="signupBtn Body1-Medium">마이페이지</router-link></div>
          </div>
      </div>
      
    </div>
  </header>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Header',
  data() {
    return {
      isLoggedIn: false, // 로그인 상태 초기값 설정
    };
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기
      this.isLoggedIn = true; // 토큰이 있으면 로그인 상태로 설정
    },
    async logout() {
      try {
        await axios.post('http://localhost:3000/api/logout', {}, { withCredentials: true });
        localStorage.removeItem('authToken'); // 로컬 스토리지에서 토큰 제거
        this.isLoggedIn = false; // 로그아웃 상태로 변경
        this.$router.push('/api/login'); // 로그아웃 후 로그인 페이지로 이동
        this.$router.go(0); // 페이지를 새로고침하여 상태 업데이트
        console.log("로그아웃 시도");
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  },
  created() {
    this.checkLoginStatus(); // 컴포넌트가 생성될 때 로그인 상태를 확인
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
  display: flex;
  align-items: center; /* 자식 요소들을 수직으로 중앙에 배치 */
}

.h-inner {
  width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center; /* 자식 요소들을 수직으로 중앙에 배치 */
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
  gap: 15px;
}

.nav>li {
  display: flex;
  align-items: center; /* 내비게이션 항목을 수직으로 중앙에 배치 */
  position: relative;
}
.nav>li>a{
  padding: 0px 10px;
  line-height: 70px; /* 항목들을 헤더 높이에 맞추어 수직으로 중앙에 배치 */
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
  align-items: center; /* 로고를 수직으로 중앙에 배치 */
  gap: 70px;
}

.rt > div {
  display: flex;
  align-items: center; /* 로그인 및 회원가입 버튼을 수직으로 중앙에 배치 */
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