const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
require("dotenv").config();

const port = process.env.PORT;

const { initializeDBConnection } = require("./db/db.connects");
const pageNotFound = require("./middlewares/pageNotFound");
const internalSeverError = require("./middlewares/internalServerError");
const authVerify = require("./middlewares/authVerify");

const userRouter = require("./routes/user.route");
const chatRouter = require("./routes/chat.route");
const messageRouter = require("./routes/message.route");

const app = express();

app.use(cors());
app.use(bodyParser.json());

initializeDBConnection();

app.get("/", (req, res) => {
  res.send("Chat App API");
});

app.use("/user", userRouter);
app.use("/chat", authVerify, chatRouter);
app.use("/message", authVerify, messageRouter);

// ** Note: DO NOT MOVE (This should be last Route) **

// 404 error route Handler
app.use(pageNotFound);

// 500 server error handler
app.use(internalSeverError);

const server = app.listen(port, () => {
  console.log("server started");
});

const io = new Server(server, {
  pingTimeout: 6000,
  cors: {
    origin: "https://blendchat.netlify.app",
  },
});

io.on("connection", (socket) => {
  console.log("socket is connected!");
  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("No user found");

    chat.users.forEach((userId) => {
      if (userId == newMessageRecieved.sender._id) return;

      socket.in(userId).emit("message recieved", newMessageRecieved);
    });
  });
});
