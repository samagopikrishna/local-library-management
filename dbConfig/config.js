var mongoose = require("mongoose");


const {DB_URL} = require("../configuration.js");


// console.log(DB_URL);
 mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = mongoose.connection;

  db.on("error",(error)=>{
      console.log("MongoDB connection error");
      console.log("error");
  })

  db.once("open",function(){
      console.log("connection established");
  })
  




  