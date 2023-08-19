//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

async function main(){
    await mongoose.connect("mongodb://0.0.0.0:27017/userDB");
    console.log("Database connected succesfully");
};

main().catch((err)=>{console.log(err)});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(()=>{res.render("secrets");
console.log("succesfully registered a new User")})
    .catch((err)=>{console.log(err)});
});


app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then((foundUser)=>{
        if (foundUser.password === password){
            console.log("Succesfully logged in User: " + foundUser.email)
            res.render("secrets");
        }
    }).catch((err)=>{console.log(err)});
})

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});









app.listen(3000, ()=>{
    console.log("Server started on port 3000");
});
