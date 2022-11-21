const express = require("express")    //variable
const bodyParser = require("body-parser")   //variable
const path = require('path')
const app = express()    //object created

// app.set('view engine','ejs')

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({extended:true}))


// Homepage
app.get("/",function(req, res){
    res.sendFile(__dirname+"/public/html/homepage.html");
})
app.get("/forgot-password",function(req, res){
    res.sendFile(__dirname+"/public/html/forgot-password.html");
})


// Admin
app.get("/admin/login",function(req, res){
    res.sendFile(__dirname+"/public/html/admin/login.html");
})
app.get("/admin/home",function(req, res){
    res.sendFile(__dirname+"/public/html/admin/home.html");
})
app.get("/admin/routes",function(req, res){
    res.sendFile(__dirname+"/public/html/admin/routes.html");
})
app.get("/admin/new-registration",function(req, res){
    res.sendFile(__dirname+"/public/html/admin/newreg.html");
})


// Passenger
app.get("/passenger/login",function(req, res){
    res.sendFile(__dirname+"/public/html/passenger/login.html");
})
app.get("/passenger/home",function(req, res){
    res.sendFile(__dirname+"/public/html/passenger/home.html");
})






// app.post("/signin",function(req,res){
//     var username = req.body.lname
//     var password =req.body.password
//     console.log(username+" "+password)
// })

app.listen("3000",function(){
    console.log("Hey iM listening")
})
