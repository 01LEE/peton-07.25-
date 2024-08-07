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

// 1.3 나를 제외한 유저만 표시
/*
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
            fetch('/createChatRoom', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ chatRoomName: user.nick_name })
            })
            .then(response => response.json())
            .then(data => {
              const chatRoomId = data.chatRoomId;
              window.location.href = `/chat?roomId=${chatRoomId}`;
            })
            .catch(error => console.error('Error creating chat room:', error));
          });
          listItem.appendChild(chatButton);
          userList.appendChild(listItem);
        }
      });
    })
    .catch(error => console.error('Error fetching active users:', error));
});
*/

// 1.2 접속 유저 리뉴얼 본인 강조 및 채팅 버튼 상시 표시
/*
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
        const listItem = document.createElement('li');
        console.log(`Comparing user_id: ${user.user_id} with currentUser.user_id: ${currentUser.user_id}`); // 비교 로그 출력
        if (user.user_id === currentUser.user_id) {
          // 현재 사용자인 경우
          listItem.textContent = `# ME > ${user.nick_name} <`;
          listItem.style.fontWeight = 'bold';
          listItem.style.color = 'blue';
        } else {
          // 다른 사용자인 경우
          listItem.textContent = `${user.nick_name}`;
          const chatButton = document.createElement('button');
          chatButton.textContent = '채팅하기';
          chatButton.addEventListener('click', () => {
            console.log(`Chat button clicked for user: ${user.nick_name}`);
          });
          listItem.appendChild(chatButton);
        }
        userList.appendChild(listItem);
      });
    
    })
    .catch(error => console.error('Error fetching active users:', error));
});
*/

// 1.1 오른쪽 클릭 이벤트 추가
/*
document.addEventListener('DOMContentLoaded', () => {
  const userList = document.getElementById('userList');
  const contextMenu = document.getElementById('contextMenu');
  let selectedUser = null;
  let currentUser = null; // 초기화 수정

  // 현재 사용자 정보를 가져와서 저장
  fetch('/getCurrentUser')
    .then(response => response.json())
    .then(data => {
      currentUser = data;
      console.log('Current user:', currentUser);

      // 현재 사용자 정보를 가져온 후 활성 사용자 목록 가져오기
      fetch('/active-users')
        .then(response => response.json())
        .then(data => {
          userList.innerHTML = ''; // 기존 사용자 목록 초기화

          // // 중복된 사용자 제거 및 현재 사용자 필터링
          // const uniqueUsers = data.filter((user, index, self) =>
          //   index === self.findIndex((u) => (
          //     u.user_id === user.user_id
          //   ))
          // );

          uniqueUsers.forEach(user => {
            const listItem = document.createElement('li');
            if (user.user_id === currentUser.user_id) {
              // 현재 사용자인 경우
              listItem.textContent = `# ME > ${user.nick_name} <`;
            } else {
              // 다른 사용자인 경우
              listItem.textContent = `${user.nick_name}`;
            }
            listItem.dataset.userId = user.user_id;
            listItem.dataset.nickName = user.nick_name;

            // 오른쪽 클릭 이벤트 리스너 추가
            listItem.addEventListener('contextmenu', (event) => {
              event.preventDefault();
              selectedUser = user;
              contextMenu.style.top = `${event.pageY}px`;
              contextMenu.style.left = `${event.pageX}px`;
              contextMenu.style.display = 'block';
            });

            userList.appendChild(listItem);
          });
        })
        .catch(error => console.error('Error fetching active users:', error));
    })
    .catch(error => console.error('Error fetching current user:', error));

  // 문서 전체에 대한 클릭 이벤트 리스너 추가
  document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
  });

  // "채팅하기" 버튼 클릭 이벤트 리스너 수정
  document.getElementById('chatButton').addEventListener('click', () => {
    if (selectedUser) {
      console.log(`Chat button clicked for user: ${selectedUser.nick_name} (${selectedUser.email})`);
    }
  });
});
*/

// 1.0
/*
document.addEventListener('DOMContentLoaded', () => {
  const userList = document.getElementById('userList');
  

  fetch('/active-users')
    .then(response => response.json())
    .then(data => {
      userList.innerHTML = ''; // Clear previous user list

      // 중복된 사용자를 제거합니다.
      const uniqueUsers = data.filter((user, index, self) =>
        index === self.findIndex((u) => (
          u.user_id === user.user_id
        ))
      );

      uniqueUsers.forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = `${user.nick_name} (${user.email})`;
        userList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error fetching active users:', error));
});
*/