// src/plugins/socket.js
import { io } from 'socket.io-client';

// 서버 주소를 설정합니다.
const socket = io('http://localhost:3000', {
  withCredentials: true,
});

export default socket;
