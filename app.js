//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");




const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
  email:String,
  password: String
});

console.log(process.env.API_KEYS);

userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});


const User = mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/register",(req,res)=>{
  const newUser = new User ({
    email: req.body.username,
    password:req.body.password
  });

  newUser.save().then(()=>{
       res.render("secrets");
   }).catch((err)=>{
       console.log(err);
   });
  });


  app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

  User.findOne({email: username}).then((result)=>{
    if(result){
      if(result.password === password){
        res.render("secrets");
      }
    }else{
      console.log("username does not exist");
    }
  }).catch((err)=>{
    console.log(err);
  });
  });

app.listen(3000,function(req,res){
  console.log("App is running on port 3000");
});
