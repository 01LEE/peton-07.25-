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
          <H1>Peton</H1>
          <h3 v-if="currentUser">환영합니다, {{ currentUser.nick_name }}님!</h3>
          <h3 v-else>사용자 정보를 불러오는 중...</h3>
        </div>

         <!-- 컨텐츠 영역 -->
        <div class="content">
          <!-- 로딩 중 메시지 표시 -->
          <div v-if="isLoading">로딩 중...</div>
          <div v-else>
            <div v-if="activeTab === 'users'">
              <!-- 유저 목록 표시 -->
              <h3>유저 목록</h3>
              <ul>
                <li v-for="user in otherUsers" :key="user.user_id" @click="openChatRoom(user)">
                  {{ user.nick_name }}
                </li>
              </ul>
            </div>

            <div v-if="activeTab === 'chatrooms'">
              <!-- 채팅방 목록 표시 및 삭제 버튼 추가 -->
              <h3>채팅방 목록</h3>
              <ul>
                <li v-for="chatRoom in chatRooms" :key="chatRoom.id" @click="openChatRoom(chatRoom.other_user)">
                  {{ chatRoom.other_user.nick_name }}
                  <button @click.stop="deleteChatRoom(chatRoom.id)">삭제</button>
                </li>
              </ul>
            </div>
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
    <ChatRoom 
      v-if="showChatRoom" 
      :currentUser="currentUser"
      :selectedUser="selectedUser"
      :currentRoomId="currentRoomId" 
      @closeChatRoom="closeChatRoom" 
      @goBack="goBackToChatList" 
    />
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
      currentUser: {}, // 현재 유저 정보를 저장
      selectedUser: {}, // 선택된 유저 정보를 저장
      otherUsers: [], // 다른 유저 정보를 저장
      chatRooms: [],
      activeTab: 'users', // 'users' 또는 'chatrooms'
      currentRoomId: null,
      isLoading: true // 로딩 상태를 관리
    };
  },
  mounted() {
    this.checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태 확인
    this.fetchChatRooms(); // 채팅방 목록 로드
    console.log("챗 버튼 마운트");

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
        this.fetchUserData(); // 로그인 후 사용자 데이터 가져오기
      }
    },
    fetchUserData() {
      // 로딩 상태 시작
      this.isLoading = true;

      axios.get('/api/getCurrentUser')
        .then(userResponse => {
          const currentUser = userResponse.data;

          if (!currentUser || !currentUser.user_id) {
            console.error('로그인한 사용자 정보를 가져올 수 없습니다.');
            return;
          }

          this.currentUser = currentUser;

          // 이제 다른 모든 유저 정보를 가져옵니다.
          return axios.get('/api/users-all');
        })
        .then(usersResponse => {
          const allUsers = usersResponse.data;

          this.otherUsers = allUsers.filter(user => user.user_id !== this.currentUser.user_id);

          console.log("Current user:", this.currentUser);
          console.log("Other users:", this.otherUsers);
        })
        .catch(error => {
          console.error('유저 정보를 가져오는 중 오류 발생:', error);
        })
        .finally(() => {
          // 로딩 상태 종료
          this.isLoading = false;
        });
    },
    fetchChatRooms() {
      this.isLoading = true;

      axios.get('/api/chatlist')
        .then(response => {
            console.log("Fetched chat rooms:", response.data);
            this.chatRooms = response.data;

        })
        .catch(error => {
            console.error('채팅방 목록을 가져오는 중 오류 발생:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    deleteChatRoom(roomId) {
      axios.delete(`/api/deleteChatRoom?roomId=${roomId}`)
        .then(() => {
          console.log(`Chat room ${roomId} deleted`);
          this.fetchChatRooms();
        })
        .catch(error => {
          console.error('채팅방 삭제 중 오류 발생:', error);
        });
    },
    // 상대 유저의 정보를 ChatRoom.vue로 전달
    openChatRoom(targetUser) {
  console.log('openChatRoom called with user:', targetUser);

  // 대상 사용자의 정보가 올바르게 전달되었는지 확인
  if (!targetUser || !targetUser.user_id || !targetUser.nick_name) {
    console.error('Target user information is incomplete', targetUser);
    return;
  }

  this.selectedUser = targetUser;
  console.log('Selected user:', this.selectedUser);

  // 현재 유저와 선택된 유저의 정보를 ChatRoom.vue로 전달
  this.showModal = false;
  this.showChatRoom = true;
},


    /*
    joinExistingChatRoom(roomId) {
    const chatRoom = this.chatRooms.find(room => room.id === roomId);
    console.log('joinExistingChatRoom found chatRoom:', chatRoom); // 로그 추가
    if (!chatRoom || !chatRoom.other_user_name) {
        console.error('Other user name is undefined');
        return;
    }
    this.selectedUserNickname = chatRoom.other_user_name;
    console.log('Selected user nickname:', this.selectedUserNickname); // 로그 추가

    this.currentRoomId = roomId;

    // 기존 채팅방으로 이동할 때마다 메시지 목록을 초기화합니다.
      this.messages = [];
      this.showModal = false;
      this.showChatRoom = true;
      this.loadMessages(roomId);
    },
    */

    /*
    loadMessages(roomId) {
      axios.get(`/api/messages?roomId=${roomId}`)
        .then(response => {
          this.messages = response.data;
        })
        .catch(error => {
          console.error('메시지를 가져오는 중 오류 발생:', error);
        });
    },
    */

    /*
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
    */

    /*
    scrollChatToBottom() {
      this.$nextTick(() => {
        const chatContent = this.$el.querySelector('.chat-content');
        chatContent.scrollTop = chatContent.scrollHeight;
      });
    },
    */
   
    // 모달 열기
    openModal() {
      console.log("openModal called");
  this.showModal = true;
  this.activeTab = 'users';  // 기본적으로 유저 목록을 먼저 보여줍니다
  // this.fetchUserData (); // 모달이 열릴 때 유저 목록을 먼저 보여줌
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
      this.fetchUserData(); // 유저 목록을 가져옴
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
  background-color: var(--primary-normal);
  padding: 20px;
  border-radius: 15px;
  width: 85%;
  max-width: 400px;
  margin-bottom: 20px;
  margin-right: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 70%; /* 모달 창의 전체 높이 조정 */
  box-sizing: border-box;
  overflow: hidden; /* 전체 모달 창에서 스크롤을 방지 */
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
  margin-bottom: 20px; /* Navbar와 겹치지 않도록 여백 추가 */
}

.content {
  flex: 1;
  color: white;
  overflow-y: auto; /* content 영역만 스크롤 가능하도록 설정 */
  padding-bottom: 60px; /* navbar 높이만큼 여백 추가 */
  box-sizing: border-box;
}

.content ul {
  list-style: none;
  padding: 0;
}

.content li {
  margin: 5px 0;
  padding: 10px;
  background-color: var(--primary-dark);
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.content li:hover {
  background-color: var(--primary-light) !important;
  color: var(--secondary-light) !important;
}

.navbar {
  position: absolute; /* 부모 요소의 하단에 고정되도록 설정 */
  bottom: 0; /* 모달 창의 하단에 고정 */
  left: 0;
  right: 0;
  background-color: var(--primary-dark);
  border-radius: 0 0 10px 10px;
  display: flex;
  justify-content: space-between;
  height: 50px;
  padding: 10px;
  width: calc(100% - 40px); /* 좌우 패딩을 고려한 너비 설정 */
  box-sizing: border-box; /* padding과 border가 width와 height에 포함되도록 설정 */
  /*border-top: 2px solid white;위쪽에 흰색 선 추가 */
  margin: 0 auto; /* 중앙 정렬을 위해 추가 */
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
  transition: background-color 0.3s ease; /* 색상 변화에 대한 부드러운 전환 */
}

.navbar button:hover {
  background-color: var(--primary-light);
  color: var(--secondary-light); /* 텍스트 색상도 변경 */
}
</style>