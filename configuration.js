
var path = require('path');

require("dotenv").config({
    path: path.join(__dirname,"./.env")
  })

  console.log(process.env.DB_URL)


  module.exports = {
     DB_URL: process.env.DB_URL
  }