var express = require("express");
var http = require("http");
var socketio = require("socket.io");

var app = express();
var server = http.Server(app);
var io = socketio(server);

var connectedUsers = 0;

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
