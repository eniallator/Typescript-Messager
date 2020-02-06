import express from "express";
import http from "http";
import socketIO from "socket.io";

require("dotenv").config();

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: socketIO.Server = socketIO(server);

const nicknames: Record<number, string> = {};
let currId: number = 0;

server.listen(process.env.SOCKET_PORT);

app.use(express.static("public"));

io.on("connection", (socket: socketIO.Socket) => {
  const id: number = currId++;
  nicknames[id] = "anonymous";

  socket.on("nickname-change", (newNickname: string) => {
    const oldNickname: string = nicknames[id];
    nicknames[id] = newNickname;
    socket.broadcast.emit(
      "console",
      `${oldNickname} has changed their name to ${newNickname}`
    );
  });

  socket.on("send-msg", (msg: string) => {
    socket.broadcast.emit("msg", nicknames[id], msg);
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Messaging app listening on port ${process.env.PORT}`)
);
