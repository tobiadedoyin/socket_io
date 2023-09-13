const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const PORT = 3040;

const user = new Set();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

io.on("connection", (socket) => {
  user.add(socket.id);
  io.emit("userConnected", socket.id);
  console.log(socket.id, "++++++++=connected");

  socket.on("disconnect", () => {
    user.delete(socket.id);
    socket.broadcast.emit("userDisconnected", socket.id);
  });

  socket.on("chat message", (message) => {
    io.emit("chat message", message);
  });
});

httpServer.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
