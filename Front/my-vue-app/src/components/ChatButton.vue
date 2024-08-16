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

        <!-- 현재 로그인된 유저의 닉네임 표시 -->
        <div class="user-info">
          <h3>환영합니다, {{ userNickname }}님!</h3>
        </div>

         <!-- 컨텐츠 영역 -->
         <div class="content">
          <div v-if="activeTab === 'users'">
            <!-- 유저 목록 표시 -->
            <h3>유저 목록</h3>
            <ul>
              <li v-for="user in users" :key="user.user_id" @click="openChatRoom(user.user_id, user.nick_name)">
                {{ user.nick_name }}
              </li>
            </ul>
          </div>

          <div v-if="activeTab === 'chatrooms'">
            <!-- 채팅방 목록 표시 및 삭제 버튼 추가 -->
            <h3>채팅방 목록</h3>
            <ul>
              <li v-for="chatRoom in chatRooms" :key="chatRoom.id" @click="openChatRoom(chatRoom.other_user_id, chatRoom.other_user_name)">
                {{ chatRoom.other_user_name }}
                <button @click="deleteChatRoom(chatRoom.id)">삭제</button>
              </li>
            </ul>
          </div>
        </div>

        <!-- 네비게이션 바 -->
        <div class="navbar">
          <button @click="showUsers">유저 목록</button>
          <button @click="showChatRooms">채팅방 목록</button>
        </div>
      </div>
    </div>

    <!-- ChatRoom 모달 -->
    <ChatRoom v-if="showChatRoom" :roomId="currentRoomId" @closeChatRoom="closeChatRoom" @goBack="goBackToChatList" />
  </div>
</template>

<script>
import axios from 'axios';
import ChatRoom from '@/components/ChatRoom.vue';
import emitter from '@/eventBus';

export default {
  name: 'ChatButton',
  components: {
    ChatRoom
  },
  data() {
    return {
      isLoggedIn: false,
      showModal: false,
      showChatRoom: false,
      userNickname: '',
      users: [],
      chatRooms: [],
      activeTab: 'users', // 'users' 또는 'chatrooms'
      currentRoomId: null,
      currentUserId: null,
      messages: [] // 채팅 메시지 저장
    };
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

      if (this.isLoggedIn) {
        this.fetchUserNickname();
        this.fetchCurrentUserId(); // 현재 로그인한 유저의 ID를 가져옵니다.
      }
    },
    fetchCurrentUserId() {
      axios.get('/api/current-user-id')  // 서버에서 현재 로그인한 유저의 ID를 가져오는 API
        .then(response => {
          this.currentUserId = response.data.userId;
          console.log('현재 유저의 ID:', this.currentUserId);
        })
        .catch(error => {
          console.error('유저 ID를 가져오는 중 오류 발생:', error);
          this.currentUserId = null;
      });
    },
    fetchUserNickname() {
      // 여기서는 로컬 스토리지나 서버로부터 닉네임을 가져오는 API 호출을 예시로 들겠습니다.
      axios.get('/api/username')  // 현재 유저의 정보를 가져오는 API 경로
        .then(response => {
          this.userNickname = response.data.nick_name || '알 수 없는 유저';
        })
        .catch(error => {
          console.error('유저 닉네임을 가져오는 중 오류 발생:', error);
          this.userNickname = '알 수 없는 유저';
        });
    },
    fetchAllUsers() {
      axios.get('/api/users-all')  // 모든 유저를 불러오는 API 경로
        .then(response => {
          console.log("Fetched users:", response.data); // 유저 목록을 콘솔에 출력
          this.users = response.data;
        })
        .catch(error => {
          console.error('유저 목록을 가져오는 중 오류 발생:', error);
        });
    },
    fetchChatRooms() {
      axios.get('/api/chatlist') // 채팅방 목록을 가져오는 API 경로
        .then(response => {
          console.log("Fetched chat rooms:", response.data);
          this.chatRooms = response.data;
        })
        .catch(error => {
          console.error('채팅방 목록을 가져오는 중 오류 발생:', error);
        });
    },
    deleteChatRoom(roomId) {
      axios.delete(`/api/deleteChatRoom?roomId=${roomId}`) // 채팅방 삭제 요청
        .then(() => {
          console.log(`Chat room ${roomId} deleted`);
          this.fetchChatRooms(); // 삭제 후 채팅방 목록 갱신
        })
        .catch(error => {
          console.error('채팅방 삭제 중 오류 발생:', error);
        });
    },
    openChatRoom(targetUserId, targetUserName) {
      const userId = this.currentUserId;

      axios.post('/api/createOrFindChatRoom', { userId, targetUserId, targetUserName })
        .then(response => {
          const chatRoomId = response.data.chatRoomId;
          if (chatRoomId) {
            this.currentRoomId = chatRoomId;
            this.showModal = false; // ChatButton 모달 닫기
            this.showChatRoom = true; // ChatRoom 모달 열기
            this.loadMessages(chatRoomId); // 채팅방의 기존 메시지 로드
          } else {
            console.error('채팅방 생성 또는 조회 중 문제가 발생했습니다.');
          }
        })
        .catch(error => {
          console.error('채팅방으로 이동 중 오류 발생:', error);
        });
    },
    loadMessages(roomId) {
      axios.get(`/api/messages?roomId=${roomId}`)
        .then(response => {
          this.messages = response.data;
        })
        .catch(error => {
          console.error('메시지를 가져오는 중 오류 발생:', error);
        });
    },
    sendMessage() {
      if (this.newMessage.trim() === '') return;

      const chatMessage = {
        roomId: this.currentRoomId,
        sender: this.currentUserId,
        receiver: 'all',
        message: this.newMessage
      };

      axios.post('/api/sendMessage', chatMessage)
        .then(() => {
          this.messages.push(chatMessage); // 메시지를 채팅창에 추가
          this.newMessage = ''; // 입력 필드 초기화
          this.scrollChatToBottom(); // 스크롤을 하단으로 이동
        })
        .catch(error => {
          console.error('메시지 전송 중 오류 발생:', error);
        });
    },
    scrollChatToBottom() {
      this.$nextTick(() => {
        const chatContent = this.$el.querySelector('.chat-content');
        chatContent.scrollTop = chatContent.scrollHeight;
      });
    },
    // 모달 열기
    openModal() {
  console.log("openModal called");
  this.showModal = true;
  this.activeTab = 'users';  // 기본적으로 유저 목록을 먼저 보여줍니다
  this.fetchAllUsers(); // 모달이 열릴 때 유저 목록을 먼저 보여줌
    },
    // 모달 닫기
    closeModal() {
      this.showModal = false;
    },
    closeChatRoom() {
      this.showChatRoom = false;
    },
    goBackToChatList() {
      this.showChatRoom = false;
      this.showModal = true;
      this.activeTab = 'chatrooms';
      this.fetchChatRooms();
    },
    showUsers() {
      this.activeTab = 'users';
      this.fetchAllUsers(); // 유저 목록을 가져옴
    },
    showChatRooms() {
      this.activeTab = 'chatrooms';
      this.fetchChatRooms(); // 채팅방 목록을 가져옴
    }
  }
};
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
  margin-bottom: 20px; /* 하단 공간 추가 */
  margin-right: 20px; /* 오른쪽 공간 추가 */
  overflow-y: auto;
  position: relative; /* 닫기 버튼 위치 조정 위해 */
  display: flex;
  flex-direction: column; /* 네비바를 하단에 고정하기 위해 flex 사용 */
  justify-content: flex-start; /* 상단부터 콘텐츠를 채움 */
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

.user-info {
  text-align: center;
  color: white;
}
.content {
  flex: 1;
  margin-top: 20px;
  color: white;
  overflow-y: auto; /* 컨텐츠가 많아질 경우 스크롤 가능 */
}

.content ul {
  list-style: none;
  padding: 0;
}

.content li {
  margin: 5px 0;
}

.navbar {
  width: 90%; /* 모달 창의 90% 너비 */
  height: 10%; /* 모달 창의 10% 높이 */
  position: absolute;
  top: 450px; /* 모달 창의 하단에 위치 */
  left: 50%; /* 중앙에 위치하도록 설정 */
  transform: translateX(-50%); /* 가로 방향으로 중앙 정렬 */
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: var(--primary-dark);
  border-radius: 10px; /* 네비게이션 바의 둥근 모서리 추가 */
}

.navbar button {
  flex: 1;
  padding: 10px;
  margin: 0 5px;
  background-color: var(--primary-dark);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.navbar button:hover {
  background-color: var(--primary-light);
}
</style>