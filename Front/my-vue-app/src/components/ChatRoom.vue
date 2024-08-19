<template>
  <div v-if="showModal" class="modal-overlay" @click="closeChatRoom">
    <div class="modal-content" @click.stop>
      <!-- 상단 바 -->
      <div class="top-bar">
        <button class="back-button" @click="goBack">＜</button>
        <div class="chat-partner">
          {{ selectedUser?.nick_name || '알 수 없는 유저' }}
        </div>
        <button class="close-button" @click="closeChatRoom">X</button>
      </div>

      <!-- 로딩 중일 때 로딩 메시지 표시 -->
      <div v-if="isLoading">로딩 중...</div>
      <div v-else class="chat-content">
        <ul>
          <li 
            v-for="message in messages" 
            :key="message.id" 
            :class="{'my-message': message.isMine, 'other-message': !message.isMine}">
            <div v-if="!message.isMine" class="sender-name">
              {{ message.senderNickname }}
            </div>
            <div v-if="!message.isMine" class="sender-message-text">
              {{ message.text }}
            </div>
            <div v-if="message.isMine" class="message-text">
              {{ message.text }}
            </div>
          </li>
        </ul>
      </div>

      <!-- 메시지 입력 및 전송 버튼 -->
      <div class="chat-input">
        <input v-model="newMessage" placeholder="메시지 입력" @keyup.enter="handleSendMessage" />
        <button @click="handleSendMessage">전송</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';  // axios를 임포트합니다.
import { io } from 'socket.io-client'; // socket.io-client를 임포트합니다.

export default {
  props: ['currentUser', 'selectedUser', 'currentRoomId'], // 유저 정보 props로 받기
  data() {
    return {
      showModal: true,
      messages: [],
      newMessage: '',
      socket: null,
      roomId: null, // roomId 초기값 설정
      isLoading: true // 로딩 상태를 관리
    };
  },
  computed: {
    currentUserId() {
      return this.currentUser ? this.currentUser.user_id : null;
    }
  },
  async mounted() {
    if (!this.currentUser || !this.selectedUser) {
        console.error('currentUser 또는 selectedUser 정보가 없습니다.');
        return;
    }
    console.log('ChatRoom mounted with currentUser:', this.currentUser, 'and selectedUser:', this.selectedUser);

    try {
        this.roomId = await this.createOrFindChatRoom();

        this.socket = io('http://localhost:3000');
        this.socket.on('connect', () => {
            console.log('Socket.IO 연결 성공');
            this.socket.emit('joinRoom', this.roomId);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket.IO 연결 실패:', error);
        });

        this.setupSocketListeners();

        // 메시지를 로드합니다.
        await this.fetchMessages();
    } catch (error) {
        console.error('채팅방 생성 또는 조회 중 오류 발생:', error);
    } finally {
        this.isLoading = false;
    }
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.emit('leaveRoom', this.roomId); // 서버에 연결 해제 알림
      this.socket.disconnect();
    }
  },
  methods: {
    // methods 내에 채팅방 생성 및 이동을 위한 메서드들
    async createOrFindChatRoom() {
      try {
        const response = await axios.post('/api/createOrFindChatRoom', {
          userId: this.currentUser.user_id,
          targetUserId: this.selectedUser.user_id,
          targetUserName: this.selectedUser.nick_name
        });
        const chatRoomId = response.data.chatRoomId;
        if (!chatRoomId) {
          throw new Error('채팅방 ID를 생성하거나 찾을 수 없습니다.');
        }
        return chatRoomId;
      } catch (error) {
        console.error('채팅방 생성 또는 조회 중 오류 발생:', error);
        throw error;
      }
    },

    async fetchMessages() {
      if (!this.roomId) {
        console.error('유효하지 않은 roomId입니다.');
        return;
      }
      try {
        const response = await axios.get(`/api/messages?roomId=${this.roomId}`);
        this.messages = response.data.map(msg => ({
          id: msg.id,
          sender: msg.sender,
          senderNickname: msg.senderNickname,
          text: msg.message,
          isMine: msg.sender === this.currentUser.login_id
        }));
      } catch (error) {
        console.error('메시지를 가져오는 중 오류 발생:', error);
      }
      this.scrollChatToBottom()
    },

    handleSendMessage() {
      if (this.newMessage.trim() === '') return;

      if (!this.currentUser || !this.currentUser.user_id || !this.currentUser.nick_name) {
        console.error('메시지를 전송할 수 없습니다. 유저 정보가 누락되었습니다.');
        return;
      }

      const chatMessage = {
        roomId: this.roomId,
        sender: this.currentUser.user_id,
        senderNickname: this.currentUser.nick_name,
        receiver: this.selectedUser.user_id,
        message: this.newMessage
      };

      console.log('전송할 메시지:', chatMessage);

      this.socket.emit('sendMessage', chatMessage);

      // 메시지를 화면에 즉시 추가
      // this.addMessageToChat(chatMessage);

      
      this.newMessage = '';
    },


    addMessageToChat(data) {
      const message = {
        id: Date.now(),
        sender: data.sender,
        senderNickname: data.senderNickname,
        text: data.message,
        isMine: data.sender === this.currentUser.user_id
      };

      this.messages.push(message);
      console.log('현재 메시지 리스트:', this.messages);
      this.scrollChatToBottom();
    },

    scrollChatToBottom() {
      this.$nextTick(() => {
        const chatContent = this.$el.querySelector('.chat-content');
        chatContent.scrollTop = chatContent.scrollHeight;
      });
    },

    setupSocketListeners() {
  this.socket.on('message', (data) => {
    console.log('서버로부터 수신한 메시지:', data); // 서버에서 수신한 메시지 로그

    // 수신한 메시지를 `messages` 배열에 추가하여 상태를 업데이트
    this.addMessageToChat(data);
  });
    },

    closeChatRoom() {
      this.showModal = false;
      this.$emit('closeChatRoom');
    },
    goBack() {
      this.closeChatRoom();
      this.$emit('goBack');
    },
  }
};
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  z-index: 2000;
}

.modal-content {
  background-color: var(--primary-normal);
  padding: 20px;
  border-radius: 15px;
  width: 85%;
  height: 70%;
  max-width: 400px;
  margin-bottom: 20px;
  margin-right: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: white;
}

.back-button, .close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
}

.chat-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chat-content li {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.sender-name {
  font-size: 14px;
  color: white;
  margin-bottom: 5px;
}

.message-text {
    align-self: flex-end; /* 오른쪽으로 정렬 */
    text-align: right;
    background-color: #ffd448; /* 내 메시지의 배경색 */
    color: black; /* 내 메시지의 텍스트 색상 */
    padding: 10px 15px;
    border-radius: 20px 20px 0 20px; /* 말풍선 모양의 테두리 */
    margin-bottom: 10px;
    max-width: 70%;
    display: inline-block; /* 말풍선의 크기를 텍스트에 맞게 조정 */
    position: relative;
    word-wrap: break-word; /* 긴 단어가 있을 때 자동으로 줄바꿈이 되도록 설정 */
}

.sender-message-text {
    align-self: flex-start; /* 왼쪽으로 정렬 */
    text-align: left;
    background-color: #f1f1f1; /* 상대 메시지의 배경색 */
    color: black; /* 상대 메시지의 텍스트 색상 */
    padding: 10px 15px;
    border-radius: 20px 20px 20px 0; /* 말풍선 모양의 테두리 */
    margin-bottom: 10px;
    max-width: 70%; /* 최대 너비를 70%로 설정하여 화면 크기에 따라 유동적으로 조정 */
    display: inline-block; /* 말풍선의 크기를 텍스트에 맞게 조정 */
    position: relative;
    word-wrap: break-word; /* 긴 단어가 있을 때 자동으로 줄바꿈이 되도록 설정 */
}

.chat-input {
  display: flex;
  align-items: center;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.chat-input button {
  padding: 10px 20px;
  background-color: var(--primary-dark);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: var(--primary-light);
}
</style>
