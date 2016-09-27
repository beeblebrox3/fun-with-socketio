const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.Server(app);
const io = socketio(server);

let connectedUsers = 0;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", (socket) => {
    connectedUsers++;
    io.emit("user connected", connectedUsers);

    socket.on("disconnect", () => {
        connectedUsers--;
        io.emit("user disconnected", connectedUsers);
    });

    socket.on("chat message", (message) => {
        switch (message) {
            case "clear":
                io.emit("clear");
                break;
            case "count users":
                io.emit("count users", connectedUsers);
                break;
            default:
                io.emit("chat message", message);
        }
    });
});

server.listen(3000, () => {
    console.log("listening");
});
