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
        <!-- 로그인 상태에 따라 다른 메뉴를 표시 -->
        <div v-if="isLoggedIn">
          <router-link to="/mypage" class="mypageBtn Body1-Medium">마이페이지</router-link>
          <button @click="logout" class="loginBtn Body1-Medium">로그아웃</button>
        </div>
        <div v-else>
          <router-link to="/login" class="loginBtn Body1-Medium">로그인</router-link>
          <router-link to="/signup" class="signupBtn Body1-Medium">회원가입</router-link>
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
      isLoggedIn: false,  // 로그인 상태 저장용 변수
      authToken: null,  // 토큰 저장용 변수
    };
  },
  methods: {
    async login() {
      try {
        console.log('로그인 시도 중...');
        const response = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password
        });

        const token = response.data.token;
        console.log('서버에서 받은 토큰:', token);

        localStorage.setItem('authToken', token);
        console.log('토큰이 localStorage에 저장되었습니다.');

        this.authToken = token;
        this.isLoggedIn = true; // 로그인 상태로 설정
        // if( this.isLoggedIn = true){
        //   this.$router.push('/');  // 메인 페이지로 이동
        // }
       // 페이지를 새로고침하여 상태 업데이트
      //  window.location.reload();
        this.$router.push('/');  // 메인 페이지로 이동
        this.$router.go(0);

      } catch (error) {
        console.error('로그인 중 오류 발생:', error.response ? error.response.data : error.message);
      }
    },
    checkLoginStatus() {
      const token = localStorage.getItem('authToken');
      console.log("Retrieved authToken from localStorage:", token);

      this.isLoggedIn = !!token; // 토큰이 존재하면 true, 없으면 false
      console.log("Is Logged In:", this.isLoggedIn);
      

    //   for (let i = 0; i < 1; i++) {
    //   if (this.isLoggedIn) {
    //     window.location.reload();
    //     break; // 리로드 후 반복문 종료
    //   }
    // }
    },
    async logout() {
      try {
        console.log("로그아웃 시도 중...");
        await axios.post('http://localhost:3000/api/login/logout');
        
        localStorage.removeItem('authToken');
        this.authToken = null;
        this.isLoggedIn = false; // 로그아웃 상태로 변경
        console.log("로그아웃 완료");

        this.$router.push('/login');
        window.location.reload(); // 페이지를 새로고침하여 상태 업데이트
      } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
      }
    }
  },
  created() {
    console.log("Header 컴포넌트 생성됨");
    this.checkLoginStatus();
  }
}
</script>


<style>
header {
  z-index: 2;
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
  gap: 15px;
}

.nav>li {
  display: flex;
  line-height: 70px;
  position: relative;
}
.nav>li>a{
  padding: 0px 10px;
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
.signupBtn,
.logoutBtn,
.mypageBtn {
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

/* 로그아웃 버튼과 마이페이지 버튼 스타일 */
.logoutBtn {
  color: var(--text-light-reverse);
  background-color: var(--primary-danger);
  border: none;
  cursor: pointer;
}

.mypageBtn {
  color: var(--text-light-reverse);
  background-color: var(--primary-normal);
  border: none;
}
</style>
