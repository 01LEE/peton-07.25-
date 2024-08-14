// 1.0 안정화 버전 0808 pm 09:42

document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:3000'); // 서버 URL 및 포트 확인
  
  
    const chatRoomList = document.getElementById('chat-room-list');
    const createChatRoomButton = document.getElementById('create-chat-room');
    const deleteChatRoomButton = document.getElementById('delete-chat-room');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    let deleteMode = false;
  
    // 현재 사용자 ID와 채팅 상대 ID를 설정
    let currentUserId = null;
  
    // 현재 사용자 정보를 가져와서 설정
    fetch('/getCurrentUser')
      .then(response => response.json())
      .then(data => {
        currentUserId = data.user_id;
        socket.emit('register', { userId: currentUserId }); // 사용자 등록
        console.log(`User ${currentUserId} registered`); // 등록 확인 로그 출력
      })
      .catch(error => console.error('Error fetching current user:', error));
  





    // 채팅방 목록을 가져와서 표시
    // 1.4 0808~
    const loadChatRooms = () => {
      fetch('/chatlist')
        .then(response => {
          const contentType = response.headers.get('content-type');
          if (!response.ok) {
            if (contentType && contentType.includes('application/json')) {
              return response.json().then(err => { throw err; });
            } else {
              throw new Error('Network response was not ok');
            }
          }
          return response.text(); // JSON 대신 텍스트로 응답을 받음
        })
        .then(data => {
          if (typeof data === 'string') {
            // HTML 처리
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const chatRoomListElement = doc.getElementById('chat-room-list'); // ul 요소를 선택
            if (chatRoomListElement) {
              const chatRoomList = document.getElementById('chat-room-list');
              chatRoomList.innerHTML = chatRoomListElement.innerHTML; // 기존 내용을 새로운 내용으로 대체
            }
          }
        })
        .catch(error => console.error('Error fetching chat rooms:', error));
    };


    // 채팅방 목록 새로고침
    socket.on('refreshChatList', () => {
      loadChatRooms();
    });
  
    // 페이지 로드 시 채팅방 목록 로드
    loadChatRooms();

  
    // 채팅방 생성 이벤트 수신
    socket.on('chatRoomCreated', (data) => {
      console.log(`Chat room created event received: ${data.chatRoomId}`); // 이벤트 수신 확인 로그 출력
      if (data.chatRoomId) {
        loadChatRooms(); // 새로운 채팅방이 생성되면 채팅방 목록 새로고침
      }
    });
  
    socket.on('message', (data) => {
      console.log(`New message event received: ${data.message}`);
      loadChatRooms();
    });
  
    socket.on('chatRoomDeleted', (data) => {
      console.log(`Chat room deleted event received: ${data.chatRoomId}`);
      loadChatRooms();
    });
  
    // 채팅방 생성 또는 기존 채팅방으로 이동
    createChatRoomButton.addEventListener('click', () => {
      window.location.href = '/users';
    });
  
    // 채팅방 삭제 버튼 클릭 시 체크박스 표시
    deleteChatRoomButton.addEventListener('click', () => {
      console.log('Delete chat room button clicked');
      deleteMode = true;
      toggleDeleteMode();
    });
  
    // 선택 삭제 버튼 클릭 시 선택한 채팅방의 메시지 삭제 및 채팅방 삭제
    confirmDeleteButton.addEventListener('click', () => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
      const selectedRooms = Array.from(checkboxes).map(cb => cb.dataset.roomId);
  
      if (selectedRooms.length > 0) {
        selectedRooms.forEach(roomId => {
          // 메시지 및 채팅방 삭제
          fetch(`/deleteChatRoom?roomId=${roomId}`, { method: 'DELETE' })
            .then(response => {
              if (response.ok) {
                const listItem = document.querySelector(`li[data-room-id="${roomId}"]`);
                if (listItem) {
                  listItem.remove();
                }
              } else {
                console.error('Error deleting chat room:', response.statusText);
              }
            })
            .catch(error => console.error('Error deleting chat room:', error));
        });
      }
  
      deleteMode = false;
      toggleDeleteMode();
    });
  
    // 취소 버튼 클릭 시 체크박스 숨김
    cancelDeleteButton.addEventListener('click', () => {
      deleteMode = false;
      toggleDeleteMode();
    });
  
    // 체크박스와 버튼 표시/숨김 토글
    function toggleDeleteMode() {
      const listItems = chatRoomList.querySelectorAll('li');
      listItems.forEach(item => {
        if (deleteMode) {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.dataset.roomId = item.dataset.roomId;
          checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
          });
          item.appendChild(checkbox);
        } else {
          const checkbox = item.querySelector('input[type="checkbox"]');
          if (checkbox) {
            checkbox.remove();
          }
        }
      });
  
      confirmDeleteButton.style.display = deleteMode ? 'inline-block' : 'none';
      cancelDeleteButton.style.display = deleteMode ? 'inline-block' : 'none';
      deleteChatRoomButton.style.display = deleteMode ? 'none' : 'inline-block';
    }
  });