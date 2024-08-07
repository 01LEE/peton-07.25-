// ㅡㅡ HW ㅡㅡ

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const checkServerStatus = () => {
    fetch('/ping')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
      .catch(error => {
        console.error('Server is down:', error);
      });
  };

  setInterval(checkServerStatus, 5000);
});
