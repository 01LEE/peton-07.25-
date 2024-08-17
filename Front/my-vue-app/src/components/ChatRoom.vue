<template>
  <div v-if="showModal" class="modal-overlay" @click="closeChatRoom">
    <div class="modal-content" @click.stop>
      <!-- 상단 바 -->
      <div class="top-bar">
        <button class="back-button" @click="goBack">＜</button>
        <div class="chat-partner">
          {{ otherUserNickname }}
        </div>
        <button class="close-button" @click="closeChatRoom">X</button>
      </div>

      <!-- 채팅 내용 영역 -->
      <div class="chat-content">
        <ul>
          <li 
            v-for="message in messages" 
            :key="message.id" 
            :class="{'my-message': message.isMine, 'other-message': !message.isMine}">
            <div v-if="!message.isMine" class="sender-name">
              {{ message.senderNickname }}
            </div>
            <div class="message-text">
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
  props: ['roomId', 'otherUserNickname'],
  data() {
    return {
      showModal: true,
      messages: [],
      newMessage: '',
      currentUser: null,
      socket: null,
    };
  },
  computed: {
    currentUserId() {
      return this.currentUser ? this.currentUser.user_id : null;
    }
  },
  mounted() {
    if (!this.roomId) {
      console.error('roomId가 정의되지 않았습니다.'); // roomId가 정의되지 않은 경우 콘솔에 에러를 표시합니다.
      return;
    }
    
    this.socket = io('http://localhost:3000'); // socket.io 서버에 연결합니다.

    this.socket.on('connect', () => {
      console.log('Socket.IO 연결 성공');
      this.socket.emit('joinRoom', this.roomId);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO 연결 실패:', error);
    });

    this.fetchCurrentUser();
    this.fetchMessages();
    this.setupSocketListeners();
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.emit('leaveRoom', this.roomId); // 서버에 연결 해제 알림
      this.socket.disconnect();
    }
  },
  methods: {
    fetchCurrentUser() {
  axios.get('/api/getCurrentUser')
    .then(response => {
      const userData = response.data;

      if (userData && userData.user_id && userData.login_id) {
        this.currentUser = {
          user_id: userData.user_id,
          nick_name: userData.login_id // login_id를 nick_name으로 사용
        };
        console.log('현재 유저:', this.currentUser);
        this.socket.emit('joinRoom', this.roomId); // 현재 유저가 채팅방에 입장
      } else {
        console.error('유저 정보를 불러오지 못했습니다:', response.data);
      }
    })
    .catch(error => {
      console.error('현재 유저 정보를 가져오는 중 오류 발생:', error);
    });
},
    fetchMessages() {
      axios.get(`/api/messages?roomId=${this.roomId}`)
        .then(response => {
          console.log('로드된 메시지:', response.data);  // 메시지 로드 로그
          this.messages = response.data;
        })
        .catch(error => {
          console.error('메시지를 가져오는 중 오류 발생:', error);
        });
    },
    setupSocketListeners() {
      this.socket.on('message', (data) => {
        console.log('서버로부터 수신한 메시지:', data); // 서버에서 수신한 메시지 로그
        if (data.sender !== this.currentUser) {
          this.addMessageToChat(data);
        }
      });
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
    receiver: 'all',  
    message: this.newMessage
  };

  console.log('전송할 메시지:', chatMessage);

  this.socket.emit('sendMessage', chatMessage);
  // this.addMessageToChat(chatMessage);
  this.newMessage = '';
},
    addMessageToChat(data) {
      console.log('채팅에 추가할 메시지:', data);  // 로그 추가
      const message = {
        id: Date.now(),
        sender: data.sender,
        senderNickname: data.senderNickname, // 닉네임을 함께 표시
        text: data.message,
        isMine: data.sender === this.currentUser.user_id  // 메시지 발신자가 본인인지 확인
      };
      this.messages.push(message);
      this.scrollChatToBottom();
    },
    scrollChatToBottom() {
      this.$nextTick(() => {
        const chatContent = this.$el.querySelector('.chat-content');
        chatContent.scrollTop = chatContent.scrollHeight;
      });
    },
    closeChatRoom() {
      this.showModal = false;
      this.$emit('closeChatRoom');
    },
    goBack() {
      this.closeChatRoom();
      this.$emit('goBack');
    }
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
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
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

.my-message {
  align-self: flex-end; /* 오른쪽으로 정렬 */
  text-align: right;
}

.other-message {
  align-self: flex-start; /* 왼쪽으로 정렬 */
  text-align: left;
}

.my-message .message {
  background-color: var(--primary-dark);
  color: white;
  padding: 10px; /* 말풍선 내부 여백 */
  border-radius: 15px 15px 0 15px; /* 말풍선 모양 */
  display: inline-block; /* 크기 조정 */
  max-width: 70%; /* 말풍선 최대 너비 설정 */
}

.other-message .message {
  background-color: #f0f0f0;
  color: black;
  padding: 10px; /* 말풍선 내부 여백 */
  border-radius: 15px 15px 15px 0; /* 말풍선 모양 */
  display: inline-block; /* 크기 조정 */
  max-width: 70%; /* 말풍선 최대 너비 설정 */
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
