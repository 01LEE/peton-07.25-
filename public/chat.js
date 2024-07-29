// HW

// 1.4

document.addEventListener('DOMContentLoaded', (event) => {
  const socket = io();

  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const clearButton = document.getElementById('clear-button'); // 대화 내용 모두 지우기 버튼 추가
  const messagesContainer = document.getElementById('messages');

  let currentUser = '';

  // 현재 사용자 정보를 가져와서 저장
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

  sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() === '') return; // 빈 메시지 무시

    fetch('/getCurrentUser')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const { sender, receiver } = data;
        const chatMessage = {
          sender: sender,
          receiver: receiver,
          message: message
        };
        console.log('Sending message:', chatMessage);
        socket.emit('sendMessage', chatMessage);
        messageInput.value = '';
        addMessageToChat(chatMessage, 'sender');
      })
      .catch(error => {
        console.error('Error fetching current user:', error);
      });
  });

  clearButton.addEventListener('click', () => {
    fetch('/clearMessages', { method: 'DELETE' }) // 서버에 대화 내용 모두 지우기 요청
      .then(() => {
        messagesContainer.innerHTML = ''; // 클라이언트에서 대화 내용 모두 지우기
      })
      .catch(error => console.error('Error clearing messages:', error));
  });

  socket.on('message', (data) => {
    // 내가 보낸 메시지인지 확인하여 중복 추가 방지
    if (data.sender !== currentUser) {
      addMessageToChat(data, 'receiver');
    }
  });

  const addMessageToChat = (data, type) => {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper');
    messageWrapper.classList.add(type);

    if (type === 'receiver') {
      const usernameElement = document.createElement('div');
      usernameElement.classList.add('username');
      usernameElement.textContent = data.sender;
      messageWrapper.appendChild(usernameElement);
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(type); // 이 부분 추가
    messageElement.textContent = data.message;
    messageWrapper.appendChild(messageElement);

    messagesContainer.appendChild(messageWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const loadMessages = () => {
    fetch('/getCurrentUser')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const { sender, receiver } = data;
        fetch(`/messages?sender=${sender}&receiver=${receiver}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(messages => {
            messages.forEach(message => {
              const type = message.sender === sender ? 'sender' : 'receiver';
              addMessageToChat(message, type);
            });
          })
          .catch(error => console.error('Error fetching messages:', error));
      })
      .catch(error => console.error('Error fetching current user:', error));
  };

  loadMessages();
});


// 버전 1.3
/*
document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();
  
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messagesContainer = document.getElementById('messages');
  
    let currentUser = '';
  
    // 현재 사용자 정보를 가져와서 저장
    fetch('/getCurrentUser')
      .then(response => response.json())
      .then(data => {
        currentUser = data.sender;
      });
  
    sendButton.addEventListener('click', () => {
      const message = messageInput.value;
      if (message.trim() === '') return; // 빈 메시지 무시
  
      fetch('/getCurrentUser')
        .then(response => response.json())
        .then(data => {
          const { sender, receiver } = data;
          const chatMessage = {
            sender: sender,
            receiver: receiver,
            message: message
          };
          socket.emit('sendMessage', chatMessage);
          messageInput.value = '';
          addMessageToChat(chatMessage, 'sender');
        });
    });
  
    socket.on('message', (data) => {
      // 내가 보낸 메시지인지 확인하여 중복 추가 방지
      if (data.sender !== currentUser) {
        addMessageToChat(data, 'receiver');
      }
    });
  
    const addMessageToChat = (data, type) => {
      const messageWrapper = document.createElement('div');
      messageWrapper.classList.add('message-wrapper');
      messageWrapper.classList.add(type);
  
      if (type === 'receiver') {
        const usernameElement = document.createElement('div');
        usernameElement.classList.add('username');
        usernameElement.textContent = data.sender;
        messageWrapper.appendChild(usernameElement);
      }
  
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.classList.add(type);
      messageElement.textContent = data.message;
      messageWrapper.appendChild(messageElement);
  
      messagesContainer.appendChild(messageWrapper);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
  
    const loadMessages = () => {
      fetch('/getCurrentUser')
        .then(response => response.json())
        .then(data => {
          const { sender, receiver } = data;
          fetch(`/messages?sender=${sender}&receiver=${receiver}`)
            .then(response => response.json())
            .then(messages => {
              messages.forEach(message => {
                const type = message.sender === sender ? 'sender' : 'receiver';
                addMessageToChat(message, type);
              });
            })
            .catch(error => console.error('Error fetching messages:', error));
        });
    };
  
    loadMessages();
  });
*/

// 버전 1.2
/*
document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();
  
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messagesContainer = document.getElementById('messages');
  
    sendButton.addEventListener('click', () => {
      const message = messageInput.value;
      fetch('/getCurrentUser')
        .then(response => response.json())
        .then(data => {
          const { sender, receiver } = data;
          const chatMessage = {
            sender: sender,
            receiver: receiver,
            message: message
          };
          socket.emit('sendMessage', chatMessage);
          messageInput.value = '';
          addMessageToChat(chatMessage, 'sender');
        });
    });
  
    socket.on('message', (data) => {
      addMessageToChat(data, 'receiver');
    });
  
    const addMessageToChat = (data, type) => {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.classList.add(type);
  
      if (type === 'receiver') {
        const usernameElement = document.createElement('span');
        usernameElement.classList.add('username');
        usernameElement.textContent = data.sender;
        messageElement.appendChild(usernameElement);
      }
  
      const textElement = document.createElement('div');
      textElement.textContent = data.message;
      messageElement.appendChild(textElement);
  
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
  
    const loadMessages = () => {
      fetch('/getCurrentUser')
        .then(response => response.json())
        .then(data => {
          const { sender, receiver } = data;
          fetch(`/messages?sender=${sender}&receiver=${receiver}`)
            .then(response => response.json())
            .then(messages => {
              messages.forEach(message => {
                const type = message.sender === sender ? 'sender' : 'receiver';
                addMessageToChat(message, type);
              });
            })
            .catch(error => console.error('Error fetching messages:', error));
        });
    };
  
    loadMessages();
  });
  */

// 버전 1.1
/*
  document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();
  
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messagesContainer = document.getElementById('messages');
  
    sendButton.addEventListener('click', () => {
      const message = messageInput.value;
      fetch('/getCurrentUser')
        .then(response => response.json())
        .then(data => {
          const { sender, receiver } = data;
          const chatMessage = {
            sender: sender,
            receiver: receiver,
            message: message
          };
          socket.emit('sendMessage', chatMessage);
          messageInput.value = '';
        });
    });
  
    socket.on('message', (data) => {
      const messageElement = document.createElement('div');
      messageElement.textContent = `${data.sender}: ${data.message}`;
      messagesContainer.appendChild(messageElement);
    });
  
    const loadMessages = () => {
      fetch('/getCurrentUser')
        .then(response => response.json())
        .then(data => {
          const { sender, receiver } = data;
          fetch(`/messages?sender=${sender}&receiver=${receiver}`)
            .then(response => response.json())
            .then(messages => {
              messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.textContent = `${message.sender}: ${message.message}`;
                messagesContainer.appendChild(messageElement);
              });
            })
            .catch(error => console.error('Error fetching messages:', error));
        });
    };
  
    loadMessages();
  });
*/