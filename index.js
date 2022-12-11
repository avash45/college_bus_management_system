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
    req.session.destroy();
    var springedge = require('springedge');
    res.render("html/homepage.ejs")

});

app.get("/routes", function (req, res) {
    let sql = "SELECT * FROM PASSENGER,PASS,BUS,ROUTES where PASS.pass_id=PASSENGER.pass_id AND BUS.bus_no=PASSENGER.bus_no AND BUS.route_no=ROUTES.route_no ";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render("html/routes.ejs", {data : {result: result}})
    });
});

app.get("/gallery", function (req, res) {
    res.render("html/gallery.ejs");
});


//=====================================Passenger login=====================================


app.get("/passenger/login", function (req, res) {
    res.render("html/passenger/login.ejs")
});

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
            session = req.session;
            session.userid = email;
            res.render('html/passenger/home.ejs', { data: { result: result } })
            req.session.login = "passenger"
        }
    });
})
//============================================Signup==================================
app.get("/passenger/register", function (req, res) {
    res.render("html/passenger/signup.ejs");
})

app.post("/passenger/register", (req, res) => {
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

app.get("/forgot-password", function (req, res) {
    res.render("html/forgot-password.html");
});

//===========================================Admin login==============================

app.get("/admin/login", function (req, res) {
    res.render("html/admin/login.ejs");
});

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

//============================================Admin pages==================================

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

//========================================== Passenger=========================================



app.get("/passenger/home", function (req, res) {
    session = req.session
    if (req.session) {
        let sql = "SELECT * FROM PASSENGER WHERE passenger_email='" + email + "' AND passenger_password='" + password + "';";
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render("html/passenger/home.ejs", { data: { result: result } })

        });
    }
    else {
        res.send("Please login to continue");
    }
});

app.get("/passenger/profile", function (req, res) {
    session = req.session
    if (session.userid) {
        let sql = "SELECT * FROM PASSENGER,PASS,BUS,ROUTES where PASS.pass_id=PASSENGER.pass_id AND BUS.bus_no=PASSENGER.bus_no AND BUS.route_no=ROUTES.route_no AND passenger_email='" + session.userid + "';";
        db.query(sql, (err, result) => {
            if (err) throw err;
            var status
            if (result[0].payment_status == 2) {
                status = "Payment done. Take care "
            }
            else {
                status = "Payment not done. Please pay ASAP";
            }
            res.render("html/passenger/profile.ejs", { data: { result: result, status: status } })
        });
    }
    else {
        res.send("Please login to continue")
    }
});

app.get("/passenger/viewroute", function (req, res) {
    session = req.session
    if (session.userid) {
        console.log(session.userid)
        let sql = "SELECT * FROM PASSENGER,PASS,BUS,ROUTES where PASS.pass_id=PASSENGER.pass_id AND BUS.bus_no=PASSENGER.bus_no AND BUS.route_no=ROUTES.route_no AND passenger_email='" + session.userid + "';";
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result)
            res.render("html/passenger/viewroute.ejs", { data: { result: result } })
        });
    }
    else {
        res.send("Please login to continue")
    }
    res.render("html/passenger/viewroute.ejs");
});
//=================================================Generate PDF================================
app.get("/passenger/generate_application", function (req, res) {






})



app.listen("3001", function () {
    console.log("Hey iM listening: 3001")
});
