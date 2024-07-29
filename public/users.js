// public/users.js
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
