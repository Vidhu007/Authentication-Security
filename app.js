//jshint esversion:6
require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose');

// hashing with salting
// same passwords also will get diff hashes
// in each salt round a random character is appended to the typed password and then hash function mein pass
const bcrypt = require('bcrypt')
const saltRounds = 10
// this is used to generate hash function
// hash can never be decoded 
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {
    useUnifiedTopology: true,
    useFindAndModify: true
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})



const User = new mongoose.model('User', userSchema)

app.get('/', function(req, res){
    res.render('home')
})

app.get('/login', function(req, res){
    res.render('login')
})

app.get('/register', function(req, res){
    res.render('register')
})

// we dont have a get request for "secrets" as we only 
// want to render it when user logiins or signs up

app.post('/register', function(req, res){

    bcrypt.hash(req.body.password , saltRounds , function(err, hash){
              
        const newUser = new User({
            email: req.body.username,
            password: hash
    
            // typed password ko hash function se pass karvake save karo
        })
        newUser.save(function(err){
            if(err){
                console.log(err)
            }
            else {
                  res.render('secrets')
            }
        })      

    })
  
})

app.post('/login', function(req, res){
    const username = req.body.username
    const password = req.body.password
    
    User.findOne({email: username}, function(err, foundUser){
        if(err)
        {
            console.log(err)
        }
        else {
            if(foundUser){
                bcrypt.compare(password, foundUser.password , function(err, result){
                    if(result===true)
                
                    {
                        res.render('secrets')
                    }
                })
               
            }
        }
    })
})

app.listen(3000, function(){
    console.log("Server started on port 3000");
  });


