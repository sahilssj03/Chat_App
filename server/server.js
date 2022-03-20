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
    origin: "http://localhost:3000"
  },

})

io.on("connection", (socket) => {
  console.log(socket)
})