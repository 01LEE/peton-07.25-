<template>
  <div>
    <!-- 로그인 상태일 때만 채팅 버튼 표시 -->
    <div v-if="isLoggedIn" class="chat-button" @click="openModal">
      <img src="../assets/images/chat-icon.svg" alt="Chat" class="chat-icon" />
    </div>
    
    <!-- 모달 창 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <!-- 모달의 X 버튼 -->
        <button class="close-button" @click="closeModal">X</button>
        <!-- Chatlist 컴포넌트를 모달 안에 표시 -->
        <Chatlist />
      </div>
    </div>
  </div>
</template>

<script>
import Chatlist from './Chatlist.vue';
import emitter from '@/eventBus'; // 이벤트 버스 가져오기

export default {
  name: 'ChatButton',
  data() {
    return {
      isLoggedIn: false, // 로그인 상태를 저장하는 변수
      showModal: false   // 모달 상태 관리 변수
    };
  },
  components: {
    Chatlist
  },
  mounted() {
    this.checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태 확인
    console.log("ChatButton mounted");

    // 로그인 상태 변경 이벤트 감지
    emitter.on('userLoggedIn', this.checkLoginStatus);
    emitter.on('userLoggedOut', this.checkLoginStatus);
  },
  beforeUnmount() {
    // 컴포넌트가 파괴되기 전에 이벤트 버스에서 리스너 제거
    emitter.off('userLoggedIn', this.checkLoginStatus);
    emitter.off('userLoggedOut', this.checkLoginStatus);
  },
  methods: {
    // 로그인 상태 확인
    checkLoginStatus() {
      const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기
      this.isLoggedIn = !!token; // 토큰이 있으면 로그인 상태로 설정
    },
    // 모달 열기
    openModal() {
      this.showModal = true;
    },
    // 모달 닫기
    closeModal() {
      this.showModal = false;
    }
  },
}
</script>

<style scoped>
.chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-normal);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
}

.chat-icon {
  width: 30px;
  height: 30px;
  filter: invert(100%);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end; /* 오른쪽 하단에 모달창 배치 */
  align-items: flex-end;
  z-index: 2000;
}

.modal-content {
  background-color: var(--primary-normal); /* 배경색을 메인 색상으로 변경 */
  padding: 20px;
  border-radius: 15px;
  width: 85%; /* 가로폭 조정 */
  height: 70%; /* 세로 길이 조정 */
  max-width: 400px; /* 최대 너비 설정 */
  margin-bottom: 25px; /* 하단 공간 추가 */
  margin-right: 25px; /* 오른쪽 공간 추가 */
  overflow-y: auto;
  position: relative; /* 닫기 버튼 위치 조정 위해 */
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white; /* 닫기 버튼 색상 */
}
</style>
