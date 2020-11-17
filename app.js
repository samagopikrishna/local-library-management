var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var logger = require('morgan');
var bodyParser = require("body-parser");
var router = require("./routes/catalog.js");
const expressHbs = require("express-handlebars");
var {index} = require("./controllers/bookController.js")
// var Handlebars = require("handlebars");
//  var {getAllBooks} = require("./routes/catalog")
const ifEquality = require("./views/helpers/ifEquality");



var app = express();


const hbs = expressHbs.create({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "./views/layouts"),
    partialsDir: path.join(__dirname, "./views/partials"),
    helpers: {
      ifEquality
    }
  });



  app.engine(".hbs", hbs.engine);
  app.set("view engine", ".hbs");
  app.set("views", path.join(__dirname, "./views"));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.get("/",async (req,res)=>{
    var libraryDetails=await index();
    const details = await JSON.stringify(libraryDetails) 
    var result =JSON.parse(details);
    res.status(200).render("hero.hbs",{
        layout: "main.hbs",
        data: result,
        title: "HomePage"
    })
})



app.use("/catalog",router);

var PORT = process.env.PORT ||8089;
app.listen(PORT,()=>{
    console.log("server running");
})