//=========================================Import necessary modules and create objects=========

const express = require("express")
const bodyParser = require("body-parser")
const path = require('path')
const mysql = require('mysql')
const sessions = require('express-session')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/views')))
app.use(bodyParser.urlencoded({ extended: true }))

//==============================================Session===========================================

var session;
app.use(sessions({
    secret: "secretkey",
    saveUninitialized: true,
    resave: false
}));

//=========================================Database connection=======================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'lofilines2'
});
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('SQL Connected')
});


//===============================================Homepage====================================================
app.get("/", function (req, res) {
    req.session.destroy;
    var springedge = require('springedge');


    springedge.messages.send(params, 5000, function (err, response) {
        if (err) {
            return console.log(err);
        }
        console.log(response);
    });
    res.render("html/homepage.ejs");
})

app.get("/routes", function (req, res) {
    res.render("html/routes.ejs");
});

app.get("/gallery", function (req, res) {
    res.render("html/gallery.ejs");
})


//=====================================Passenger login=====================================


app.get("/passenger/login", function (req, res) {
    res.render("html/passenger/login.ejs")
});

app.post("/passenger/login", function (req, res) {
    var email = req.body.email
    var password = req.body.password
    let sql = "SELECT * FROM USERS WHERE email='" + email + "' AND password='" + password + "';";
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            res.send("No accounts found");
        }
        else {
            session = req.session;
            session.userid = email;
            res.render('html/passenger/home.ejs')
        }
    });
});


app.get("/passenger/signup", function (req, res) {
    res.render("html/passenger/signup.ejs");
})

app.post("/passenger/signup", (req, res) => {
    fname = req.body.fname;
    phoneno = req.body.phoneno;
    designation = req.body.inlineRadioOptions
    email = req.body.email;
    usn = req.body.usn;
    addresss = req.body.addresss;
    password = req.body.password;

    console.log(email + "  " + password + "  " + fname + "  " + phoneno + "  " + designation + "  " + usn + "  " + addresss
    );

    let sql = ""
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            console.log("No accounts found");
            res.render("html/admin/login")
        }
        else {
            res.render('html/admin/home.ejs')
        }
    });
});

app.get("/admin/login", function (req, res) {
    res.render("html/admin/login.ejs");
});

app.get("/forgot-password", function (req, res) {
    res.render("html/forgot-password.html");
})

//------------------------------------Admin---------------------------------------------------------------


app.post("/admin/login", (req, res) => {
    email = req.body.email
    password = req.body.password

    console.log(email + "   " + password);


    let sql = "SELECT * FROM ADMIN WHERE admin_email='" + email + "' AND admin_password='" + password + "';";
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            console.log("No accounts found");
            res.render("html/admin/login")
        }
        else {
            res.render('html/admin/home.ejs')
            req.session.login = "true"
        }
    });
})

app.get("/admin/bus", function (req, res) {
    if (flag = 2) {
        res.render("html/admin/bus.ejs");
    }
    else {
        res.send("ADmin nahi hai yu")
    }
})

app.get("/admin/adminroutes", function (req, res) {
    res.render("html/admin/adminroutes.ejs");
})



app.get("/admin/newreg", function (req, res) {
    res.render("html/admin/newreg.ejs");
})


//------------------------------------------------------------------------------------------------------
// Passenger


app.post("/passenger/login", (req, res) => {
    email = req.body.email
    password = req.body.password

    let sql = "SELECT * FROM PASSENGER WHERE passenger_email='" + email + "' AND passenger_password='" + password + "';";
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            console.log("No accounts found");
            res.render("html/passenger/login")
        }
        else {
            pname = result[0].Passenger_name
            res.render('html/passenger/home.ejs', { data: { passenger_name: pname } })
            req.session.login = "passenger"
        }
    });
})

app.get("/passenger/home", function (req, res) {
    let sql = "SELECT * FROM PASSENGER WHERE passenger_email='" + email + "' AND passenger_password='" + password + "';";
    db.query(sql, (err, result) => {
        if (err) throw err;
        let passenger_name = result[0].Passenger_name;

    })
});


app.get("/passenger/viewroute", function (req, res) {
    res.render("html/passenger/viewroute.ejs");
});

app.get("/passenger/profile", function (req, res) {
    let sql = "SELECT * FROM PASSENGER ;";
    db.query(sql, (err, result) => {
        if (err) throw err;
        busn = result[0].bus_no
        pasid = result[0].pass_id
        addr = result[0].address
        usnn = result[0].usn
        passname = result[0].Passenger_name
        phno = result[0].Phone_no
        phmail = result[0].passenger_email
        des = reult[0].designation
        console.log("COnnected")
        res.render("html/passenger/profile.ejs", { data: { passengername: passname, designations: des } })
    });
});


app.listen("3000", function () {
    console.log("Hey iM listening: 3000")
})

//=======================================================================================

    // var params = {
    //     'apikey': '', // API Key 
    //     'sender': 'Av', // Sender Name 
    //     'to': [
    //         '9686104291'  //Moblie Number 
    //     ],
    //     'message': 'Hey'
    // };