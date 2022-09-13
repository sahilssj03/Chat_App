const express = require('express')
const app = express();
require('dotenv').config();
const cors = require('cors')
require('./model/connection')
const routes = require('./routes/routes')
const PORT = process.env.PORT || 4000;
console.clear();



app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
app.use(express.json())
app.use(cors())

app.use('/', routes)
const server = app.listen(PORT, () => { console.log(`Server is running on ${PORT}`) })

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://ag-chat-app.netlify.app"
  },

})

io.on("connection", (socket) => {
  // console.log(socket)

  socket.on("setup", (userData) => {
    socket.join(userData.data.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new Message", (newMessageRecieved) => {
    var chat = newMessageRecieved.message.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.message.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved)
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.data.id);
  });
})
