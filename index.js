const express = require('express');
const PORT = 4000;
const server = express();
const db = require('./models');
const router = require('./router/router');
require('dotenv').config();

server.use(express.json());
server.use(express.urlencoded({extended : true}));

server.use(router);

server.listen(PORT, ()=>{
  // db.sequelize.sync({ alter: true });
  console.log(`Server success running on port : ${PORT}`);
});