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
var passid = 1005;
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

//==============================================Email================================================

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lofilinesnmamit@gmail.com',
        pass: '$Lofilines0'
    }
});

//===============================================Homepage====================================================
app.get("/", function (req, res) {
    req.session.destroy();
    res.render("html/homepage.ejs")

});

app.get("/routes", function (req, res) {
    let sql = "SELECT * FROM PASSENGER,PASS,BUS,ROUTES where PASS.pass_id=PASSENGER.pass_id AND BUS.bus_no=PASSENGER.bus_no AND BUS.route_no=ROUTES.route_no ";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render("html/routes.ejs", { data: { result: result } })
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
//============================================Signup=============================================
app.get("/passenger/register", function (req, res) {
    let sql = "SELECT route_no FROM ROUTES ;";
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render("html/passenger/signup.ejs", { data: { result: result } });
    });


})

app.post("/passenger/register", (req, res) => {
    fname = req.body.fname;
    phoneno = req.body.phoneno;
    designation = req.body.inlineRadioOptions
    email = req.body.email;
    usn = req.body.usn;
    addresss = req.body.addresss;
    password = req.body.password;
    route_no = req.body.route;
    passid += 1;
    console.log(req.body)

    
    var sqls = "SELECT * FROM ROUTES where route_no='" + route_no + "';";
    db.query(sqls, (err, result) => {
        if (err) throw err;
        var money = result[0].fees;
        console.log(money)
    });
    console.log(money);

    today_date = ""
    var sqls = "SELECT NOW() as today_date;";
    db.query(sqls, (err, result) => {
        if (err) throw err;
        today_date = result[0].today_date
        today_date = JSON.stringify(today_date)

        today_date = today_date.substring(1, 11);
        console.log(today_date)
    });

    sqls = "INSERT INTO PASS values(" + money + ", " + passid + ", " + today_date + ", 0);"
    db.query(sqls, (err, result) => {
        if (err) throw err;
        console.log("Successfully Pass inserted")

    })
});

app.get("/forgot-password", function (req, res) {
    res.render("html/forgot-password.ejs");
});

//===========================================Admin login======================================

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
            req.session.userid = email
        }
    });
})

//============================================Admin pages==================================

app.get("/admin/home", function (req, res) {
    session = req.session
    if (req.session) {
        let sql = "SELECT * FROM ADMIN WHERE admin_email='" + req.userid + "';";
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render("html/admin/home.ejs")

        });
    }
    else {
        res.send("Please login to continue");
    }
});

app.get("/admin/bus", function (req, res) {
    res.render("html/admin/bus.ejs");
})

app.get("/admin/adminroutes", function (req, res) {
    res.render("html/admin/adminroutes.ejs");
})

app.get("/admin/newreg", function (req, res) {
    res.render("html/admin/newreg.ejs");
})

app.get("/admin/report", function (req, res) {

    session = req.session
    if (req.session) {
        let sql = "SELECT * FROM ADMIN WHERE admin_email='" + req.userid + "';";
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render("html/admin/report.ejs");
        });
    }
    else {
        res.send("Please login to continue");
    }



    
})

//========================================== Passenger pages=========================================



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
            if (result[0].payment_status == 1) {
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
});

//=================================================Generate PDF===================================

app.get("/passenger/application", function (req, res) {
    session = req.session;

    let sql = "SELECT * FROM PASSENGER,PASS,BUS,ROUTES where PASS.pass_id=PASSENGER.pass_id AND BUS.bus_no=PASSENGER.bus_no AND BUS.route_no=ROUTES.route_no AND passenger_email='" + session.userid + "';";
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.render("html/passenger/apply.ejs", { data: { result: result } });
    });
});

//=============================================PORT================================================
app.listen("3000", function () {
    console.log("Hey iM listening: 3000")
});
