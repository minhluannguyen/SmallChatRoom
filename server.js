"use strict";

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const auth = require("./app/auth.js");
const routes = require("./app/routes.js");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const app = express();
//const cors = require('cors');
//app.use(cors());
const http = require("http").Server(app);
const sessionStore = new session.MemoryStore();
const io = require("socket.io")(http);
const passportSocketIo = require("passport.socketio");
const bcrypt = require('bcrypt');

app.use("/public", express.static(process.cwd() + "/public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.use(session({
    secret: 'itsASecret',
    resave: true,
    key: "express.sid",
    store: sessionStore
}))

auth(app);
routes(app);

http.listen(process.env.PORT || 3000);

//start socket.io code
io.use(
    passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: "express.sid",
        secret: 'itsASecret',
        store: sessionStore,
    })
);

var currentUsers = 0;
io.on("connection", (socket) => {
    console.log("A user has connected");
    ++currentUsers;
    //console.log(socket.request.user);
    io.emit("user", {
        name: socket.request.user.Username,
        currentUsers,
        connected: true,
    });
    console.log("user " + socket.request.user.Username + " connected");

    socket.on("chat message", (data) => {
        io.emit("chat message", { name: socket.request.user.Username, message: data });
    });

    socket.on("disconnect", () => {
        --currentUsers;
        io.emit("user", {
            name: socket.request.user.Username,
            currentUsers,
            connected: false,
        });
    });
});

//end socket.io code