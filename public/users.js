// public/users.js

// 1.4 ~ 1.5 채팅하기 누를시 채팅방 생성 또는 이동

document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('userList');
    let currentUser = null;
  
    // 현재 사용자 정보를 가져와서 저장
    fetch('/getCurrentUser')
      .then(response => response.json())
      .then(data => {
        console.log('Current user data fetched from server:', data); // 응답 데이터를 로그로 출력
        currentUser = data;
        console.log('Current user:', currentUser);
  
        // 활성 사용자 목록 가져오기
        return fetch('/active-users');
      })
      .then(response => response.json())
      .then(users => {
        console.log('Active users:', users); // Active users 로그 출력
  
        userList.innerHTML = ''; // 기존 사용자 목록 초기화
  
        users.forEach(user => {
          // 현재 사용자는 표시하지 않음
          if (user.user_id !== currentUser.user_id) {
            const listItem = document.createElement('li');
            console.log(`Comparing user_id: ${user.user_id} with currentUser.user_id: ${currentUser.user_id}`); // 비교 로그 출력
            listItem.textContent = `${user.nick_name}`;
  
            // 채팅하기 버튼
            const chatButton = document.createElement('button');
            chatButton.textContent = '채팅하기';
            chatButton.addEventListener('click', () => {
              const body = {
                userId: currentUser.user_id,
                targetUserId: user.user_id,
                targetUserName: user.nick_name
              };
  
              fetch('/createOrFindChatRoom', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
              })
              .then(response => response.json())
              .then(data => {
                const chatRoomId = data.chatRoomId;
                window.location.href = `/chat?roomId=${chatRoomId}`;
              })
              .catch(error => console.error('Error creating or finding chat room:', error));
            });
  
            listItem.appendChild(chatButton);
            userList.appendChild(listItem);
          }
        });
      })
      .catch(error => console.error('Error fetching active users:', error));
  });