document.addEventListener('DOMContentLoaded', () => {
    const chatRoomList = document.getElementById('chat-room-list');
    const createChatRoomButton = document.getElementById('create-chat-room');
  
    // 채팅방 목록을 가져와서 표시
    fetch('/chatRooms')
      .then(response => response.json())
      .then(data => {
        data.forEach(room => {
          const listItem = document.createElement('li');
          listItem.textContent = `Chat Room ${room.id}`;
          listItem.addEventListener('click', () => {
            window.location.href = `/chat?roomId=${room.id}`;
          });
          chatRoomList.appendChild(listItem);
        });
      })
      .catch(error => console.error('Error fetching chat rooms:', error));
  
    // 채팅방 생성 버튼 클릭 시 채팅방 ID 생성 및 이동
    createChatRoomButton.addEventListener('click', () => {
      fetch('/createChatRoom')
        .then(response => response.json())
        .then(data => {
          const chatRoomId = data.chatRoomId;
          window.location.href = `/chat?roomId=${chatRoomId}`;
        })
        .catch(error => console.error('Error creating chat room:', error));
    });
  });
  