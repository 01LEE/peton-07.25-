<template>
    <div class="chatlist">
      <h2>채팅방 목록</h2>
      <ul>
        <li v-for="room in chatRooms" :key="room.id" @click="selectChatRoom(room.id)">
          {{ room.title }}
        </li>
      </ul>
  
      <div v-if="selectedChatRoom">
        <h3>채팅방: {{ selectedChatRoom }}</h3>
        <div class="messages">
          <div v-for="message in messages" :key="message.id">
            <strong>{{ message.sender }}:</strong> {{ message.message }}
          </div>
        </div>
        <input
          v-model="newMessage"
          placeholder="메시지를 입력하세요"
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage">전송</button>
      </div>
  
      <div class="active-users">
        <h2>활성 사용자</h2>
        <ul v-if="activeUsers.length">
          <li v-for="user in activeUsers" :key="user.id">
            {{ user.name }} ({{ user.status }})
          </li>
        </ul>
        <p v-else>접속중인 유저 없음</p>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  data() {
    return {
      activeUsers: [], // 활성 사용자 목록
      chatRooms: [],   // 채팅방 목록
      selectedChatRoom: null, // 선택된 채팅방
      messages: [],    // 선택된 채팅방의 메시지
      newMessage: '',  // 사용자가 입력한 새 메시지
    };
  },
  methods: {
    async fetchActiveUsers() {
      try {
        const response = await axios.get('http://localhost:3000/active-users');
        this.activeUsers = response.data;
      } catch (error) {
        console.error('활성 사용자 목록을 가져오지 못했습니다:', error);
      }
    },
    async fetchChatRooms() {
      try {
        const response = await axios.get('http://localhost:3000/chatlist');
        this.chatRooms = response.data.chatRooms;
      } catch (error) {
        console.error('채팅방 목록을 가져오지 못했습니다:', error);
      }
    },
    async selectChatRoom(roomId) {
      this.selectedChatRoom = roomId;
      await this.fetchMessages(roomId);
    },
    async fetchMessages(roomId) {
      try {
        const response = await axios.get('http://localhost:3000/messages', {
          params: { roomId },
        });
        this.messages = response.data;
      } catch (error) {
        console.error('메시지를 가져오지 못했습니다:', error);
      }
    },
    async sendMessage() {
      try {
        if (this.selectedChatRoom && this.newMessage.trim() !== '') {
          await axios.post('http://localhost:3000/sendMessage', {
            roomId: this.selectedChatRoom,
            sender: this.currentUser,  // 현재 사용자 정보
            receiver: this.selectedReceiver, // 선택된 상대방 정보
            message: this.newMessage,
          });
          this.newMessage = '';
          await this.fetchMessages(this.selectedChatRoom); // 메시지 목록 갱신
        }
      } catch (error) {
        console.error('메시지를 전송하지 못했습니다:', error);
      }
    },
  },
  mounted() {
    this.fetchActiveUsers();
    this.fetchChatRooms();
  },
};
</script>
