const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.getElementById('users');

// get the username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
// console.log(username, room);

const socket = io();

// join chatroom
socket.emit("joinRoom", { username, room });

// get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // console.log(event.target.elements[0].value);
  // console.log(event.target.elements.msg.value);


  // get message text
  const msg = event.target.elements.msg.value;

  // emit message to server
  socket.emit('chatMessage', msg);

  // clear input
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
});


// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
<p class="text">${message.text}</p>`;

  document.querySelector('.chat-messages').appendChild(div);
}



// leave the room

document.querySelector('#leave-btn').addEventListener('click', () => {
  window.location = "../index.html";
});

// add room name to dom
function outputRoomName(room) {
  roomName.innerHTML = room;
}

// add users to dom
function outputUsers(users) {
  // userList.innerHTML = `
  //   ${users.map(user => `<li>${user.username}</li>`).join('')}
  // `;

  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = user.username;
    userList.appendChild(li);
  });
}