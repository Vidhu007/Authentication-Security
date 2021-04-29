// Level 1
//emial and password
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose');
const e = require('express');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {
    useUnifiedTopology: true,
    useFindAndModify: true
})

const userSchema = {
    email: String,
    password: String
}

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
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
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
                if(foundUser.password===password)
                {
                    res.render('secrets')
                }
            }
        }
    })
})

app.listen(3000, function(){
    console.log("Server started on port 3000");
  });