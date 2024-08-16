<template>
  <div v-if="showModal" class="modal-overlay" @click="closeChatRoom">
    <div class="modal-content" @click.stop>
      <!-- 상단 바 -->
      <div class="top-bar">
        <button class="back-button" @click="goBack">＜</button>
        <button class="close-button" @click="closeChatRoom">X</button>
      </div>

      <!-- 채팅 내용 영역 -->
      <div class="chat-content">
        <ul>
          <li 
            v-for="message in messages" 
            :key="message.id" 
            :class="{'my-message': message.sender === currentUserId, 'other-message': message.sender !== currentUserId}">
            <div v-if="message.sender !== currentUserId" class="sender-name">
              {{ message.sender }}
            </div>
            <div class="message-text">
              {{ message.text }}
            </div>
          </li>
        </ul>
      </div>

      <!-- 메시지 입력 및 전송 버튼 -->
      <div class="chat-input">
        <input v-model="newMessage" placeholder="메시지 입력" @keyup.enter="sendMessage" />
        <button @click="sendMessage">전송</button>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import axios from 'axios';

export default {
  props: ['roomId'],
  data() {
    return {
      showModal: true,
      messages: [],
      newMessage: '',
      currentUser: null,
      socket: null,
    };
  },
  mounted() {
    this.socket = io();
    this.fetchCurrentUser();
    this.fetchMessages();
    this.setupSocketListeners();
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  methods: {
    fetchCurrentUser() {
      axios.get('/api/getCurrentUser')
        .then(response => {
          if (response.data && response.data.sender) {
            this.currentUser = response.data.sender;
            console.log('현재 유저:', this.currentUser);
            this.socket.emit('joinRoom', this.roomId); // 현재 유저가 채팅방에 입장
          } else {
            console.error('유저 정보를 불러오지 못했습니다.');
          }
        })
        .catch(error => {
          console.error('현재 유저 정보를 가져오는 중 오류 발생:', error);
        });
    },
    fetchMessages() {
      axios.get(`/api/messages?roomId=${this.roomId}`)
        .then(response => {
          console.log('로드된 메시지:', response.data); // 이전 메시지 로드 시 로그
          this.messages = response.data.map(msg => ({
            id: msg.id,
            sender: msg.sender,
            text: msg.message,
          }));
        })
        .catch(error => {
          console.error('메시지를 가져오는 중 오류 발생:', error);
        });
    },
    setupSocketListeners() {
      this.socket.on('message', (data) => {
        console.log('서버로부터 수신한 메시지:', data); // 서버에서 수신한 메시지 로그
        if (data.sender !== this.currentUser) {
          this.addMessageToChat(data, 'receiver');
        }
      });
    },
    sendMessage() {
      if (this.newMessage.trim() === '') return;

      const chatMessage = {
        roomId: this.roomId,
        sender: this.currentUser,
        receiver: 'all',
        message: this.newMessage
      };

      console.log('전송할 메시지:', chatMessage); // 메시지 전송 전 로그

      axios.post('/api/sendMessage', chatMessage)
        .then(() => {
        console.log('메시지 전송 성공'); // 메시지 전송 성공 로그
      this.addMessageToChat(chatMessage, 'sender');
      this.newMessage = '';
    })
    .catch(error => {
      console.error('메시지 전송 중 오류 발생:', error); // 메시지 전송 실패 로그
    });
    },
    addMessageToChat(data) {
      const message = {
        id: Date.now(),
        sender: data.sender,
        text: data.message,
        isMine: data.sender === this.currentUser  // 메시지 발신자가 본인인지 확인
      };
      console.log('채팅에 추가할 메시지:', message); // 메시지를 추가할 때 로그
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

.chat-content .message {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  word-wrap: break-word;
}

.chat-content .sender .message {
  background-color: var(--primary-dark);
  color: white;
  align-self: flex-end;
  text-align: right;
}

.chat-content .receiver .message {
  background-color: #f0f0f0;
  color: black;
  align-self: flex-start;
  text-align: left;
}

.chat-content .receiver .username {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
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
