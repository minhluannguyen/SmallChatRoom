# SmallChatRoom
A small chat room with authentication, registration and web socket.

+ Using ExpressJS framework.
+ Authentication with: express-session, passport.js, Local Strategy, passport.socketio.
+ Web socket with: socket.io.
+ Database using SQLite with sqlite3 library.

Try live at: https://small-chat-room.glitch.me
Setup
===

#### Install the Dependencies

```sh
npm install
```

#### In /public/client.js add the host local IP address and port if you want to connect from other devices.
```sh
var socket = io(*your IP and port goes here, ex: 192.168.0.10:3000*);
```
