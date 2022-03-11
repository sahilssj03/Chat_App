const express = require('express')
const app = express();
require('dotenv').config();
const cors = require('cors')
require('./model/Connection')
const routes = require('./routes/routes')
const PORT = process.env.PORT || 4000;
console.clear();


app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
app.use(express.json())
app.use(cors())

app.use('/', routes)
app.listen(PORT, ()=>{console.log(`Server is running on ${PORT}`)})