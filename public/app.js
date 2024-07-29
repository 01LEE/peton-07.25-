// ㅡㅡ HW ㅡㅡ

document.addEventListener('DOMContentLoaded', (event) => {
    const checkServerStatus = () => {
      fetch('/ping')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        })
        .catch(error => {
          console.error('Server is down:', error);
          alert('Server connection lost. Logging out...');
          window.location.href = '/logout';
        });
    };
  
    // 주기적으로 서버 상태 확인 (5초마다)
    setInterval(checkServerStatus, 5000);
  });
  