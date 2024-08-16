// HW

// 1.0 안정화 버전 0808 pm 09:42

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const clearButton = document.getElementById('clear-button'); // 대화 내용 모두 지우기 버튼 추가
    const messagesContainer = document.getElementById('messages');
    const chatRoomList = document.getElementById('chat-room-list');
    const createChatRoomButton = document.getElementById('create-chat-room');
  
    let currentUser = null;
    let chatRoomId = null;
  
    // 채팅방 입장 함수
    const joinChatRoom = (roomId) => {
      console.log(`Joining chat room: ${roomId}`);
      fetch('/getCurrentUser')
        .then(response => response.json())
        .then(data => {
          currentUser = data.sender;
          socket.emit('joinRoom', roomId);
          loadMessages(roomId);
        })
        .catch(error => console.error('Error fetching current user:', error));
    };
  
    
    // 메시지 로드 함수
    const loadMessages = (roomId) => {
      fetch(`/messages?roomId=${roomId}`)
        .then(response => response.json())
        .then(messages => {
          messagesContainer.innerHTML = ''; // 기존 메시지 초기화
          messages.forEach(message => {
            const type = message.sender === currentUser ? 'sender' : 'receiver';
            addMessageToChat(message, type);
          });
        })
        .catch(error => console.error('Error fetching messages:', error));
    };
    
    // 메시지를 채팅에 추가하는 함수
    const addMessageToChat = (data, type) => {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper', type);
  
        if (type === 'receiver') {
          const usernameElement = document.createElement('div');
          usernameElement.classList.add('username');
          usernameElement.textContent = data.sender;
          messageWrapper.appendChild(usernameElement);
        }
  
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = data.message;
        messageWrapper.appendChild(messageElement);
  
        messagesContainer.appendChild(messageWrapper);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
  
    // send 버튼 클릭 이벤트 리스너
    sendButton.addEventListener('click', () => {
      const message = messageInput.value.trim();
      if (message === '') return; // 빈 메시지 무시
  
    const chatMessage = {
          roomId: chatRoomId,
          sender: currentUser,
          receiver: 'all', // 'receiver' 값을 설정. 필요에 따라 적절한 값을 설정
          message: message
        };
  
    socket.emit('sendMessage', chatMessage);
        messageInput.value = '';
        addMessageToChat(chatMessage, 'sender');
      });
  
    // 메시지 수신 소켓 이벤트 리스너
    socket.on('message', (data) => {
      // 내가 보낸 메시지인지 확인하여 중복 추가 방지
      if (data.sender !== currentUser) {
        addMessageToChat(data, 'receiver');
      }
    });
  
    // 대화 내용 삭제 버튼 클릭 이벤트 리스너
    clearButton.addEventListener('click', () => {
      fetch('/clearMessages', { method: 'DELETE' }) // 서버에 대화 내용 모두 지우기 요청
        .then(() => {
          messagesContainer.innerHTML = ''; // 클라이언트에서 대화 내용 모두 지우기
        })
        .catch(error => console.error('Error clearing messages:', error));
    });
  
    // URL에서 채팅방 ID 추출 및 입장
    const urlParams = new URLSearchParams(window.location.search);
    chatRoomId = urlParams.get('roomId');
    console.log(`Extracted roomId from URL: ${chatRoomId}`);
  
  
    if (chatRoomId) {
      joinChatRoom(chatRoomId);
    }
  
    
    fetch('/getCurrentUser')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        currentUser = data.sender;
        console.log('Current user:', currentUser);
      })
      .catch(error => {
        console.error('Error fetching current user:', error);
      });
  });
