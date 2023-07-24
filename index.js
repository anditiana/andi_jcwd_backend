const express = require('express');

const server = express();
const db = require('./models');
const router = require('./router/router');
require('dotenv').config();



server.use(express.json());
server.use(express.urlencoded({extended : true}));

server.use(router);

server.listen(process.env.PORT_ENV, ()=>{
  // db.sequelize.sync({ alter: true });
  console.log(`Server success running on port : ${process.env.PORT_ENV} | ${process.env.ORIGINAL_CREATOR}`);
});