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
var passid = 10011;
var sqls
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
        console.log("Database connection error")
    }
    console.log('SQL Connected')
});

//==============================================Email================================================

var nodemailer = require('nodemailer');

let y = Math.floor((Math.random() * 9999) + 1);
let x = y.toString();
console.log(x)

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

//===========================================Admin login======================================

app.get("/admin/login", function (req, res) {
    res.render("html/admin/login.ejs");
});

app.post("/admin/login", (req, res) => {
    email = req.body.email
    password = req.body.password

    let sql = "SELECT * FROM ADMIN WHERE admin_email='" + email + "' AND admin_password='" + password + "';";
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            console.log("No accounts found");
            res.render("html/admin/login")
        }
        else {
            req.session.userid = email
            res.render('html/admin/home.ejs')

        }
    });
})

//============================================Admin pages==================================

//-------------------home-------------

app.get("/admin/home", function (req, res) {
    session = req.session
    if (session.userid) {
        let sql = "SELECT * FROM ADMIN WHERE admin_email='" + req.userid + "';";
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.render("html/admin/home.ejs")

        });
    }
    else {
        res.render("html/loginalert.ejs")
    }
});

//-------------------bus-------------

app.get("/admin/bus", function (req, res) {
    session = req.session
    if (session.userid) {
        var sqls = " SELECT * from BUS;"
        db.query(sqls, (err, result) => {
            if (err) throw err
            res.render("html/admin/bus.ejs", { data: { result: result } })
        })
    } else {
        res.render("html/loginalert.ejsr")
    }

})

app.post("/admin/bus/add", function (req, res) {
    bus_no = req.body.bus_no
    bus_model = req.body.bus_model
    bus_driver = req.body.bus_driver
    bus_capacity = req.body.bus_capacity
    route_no = req.body.route_no

    let sqls = "INSERT INTO BUS values('" + bus_driver + "'," + bus_no + ",'" + bus_model + "'," + bus_capacity + "," + route_no + ",0);"
    db.query(sqls, (err, result) => {
        if (err) { res.render("html/fail.ejs") }
        else { res.render("html/done.ejs") }
    })
});

app.post("/admin/bus/delete/:bus_no", function (req, res) {
    let bus_no = req.params.bus_no
    var sqls = "DELETE FROM BUS WHERE bus_no=" + bus_no + ";"
    db.query(sqls, (err, result) => {
        if (err) throw err
        res.render("html/admin/home.ejs")
    })
});

//-------------------routes----------

app.get("/admin/adminroutes", function (req, res) {
    session = req.session
    if (session.userid) {
        var sqls = " SELECT * from ROUTES;"
        db.query(sqls, (err, result) => {
            if (err) throw err
            res.render("html/admin/adminroutes.ejs", { data: { result: result } })
        })
    } else {
        res.render("html/loginalert.ejs")
    }
})

app.post("/admin/adminroutes/add", function (req, res) {
    route_no = req.body.route_no
    location = req.body.location
    distance = req.body.distance
    fees = req.body.fees
    link = req.body.link

    sqls = "INSERT INTO ROUTES VALUES('" + location + "'," + route_no + "," + distance + "," + fees + ",'" + link + "');"
    db.query(sqls, (err, result) => {
        if (err) { res.render("html/fail.ejs") }
        else { res.render("html/done.ejs") }
    })
})

app.post("/admin/adminroutes/delete/:route_no", function (req, res) {
    route_no = req.params.route_no
    sqls = "DELETE FROM ROUTES WHERE route_no=" + route_no + ";"
    db.query(sqls, (err, result) => {
        if (err) {
            res.render("html/fail.ejs")
        }
        else {
            res.render("html/done.ejs")
        }
    })
})

//-------------------New registration----------

app.get("/admin/newreg", function (req, res) {
    session = req.session
    if (session.userid) {
        sqls = " SELECT * from PASSENGER,PASS where PASSENGER.pass_id=PASS.pass_id ORDER BY PASSENGER.pass_id ;"
        db.query(sqls, (err, result) => {
            if (err) throw err
            res.render("html/admin/newreg.ejs", { data: { result: result } });
        })
    } else {
        res.render("html/loginalert.ejs")
    }
})

//--------------------Report-----------------

app.get("/admin/report", function (req, res) {
    session = req.session
    if (session.userid) {
        var sqls = "Select count(*) as student_count from PASSENGER where designation='student';"
        db.query(sqls, (err, result) => {
            if (err) console.log("Student count error");
            var student_count = result[0].student_count

            sqls = "Select count(*) as student_count from PASSENGER where designation='faculty';"
            db.query(sqls, (err, result) => {
                if (err) console.log("Faculty count error")
                var faculty_count = result[0].student_count
                total_count = faculty_count + student_count

                sqls = "SELECT count(*) as total_bus , sum(bus_capacity) as total_capacity from BUS;"
                db.query(sqls, (err, result) => {
                    if (err) console.log("Bus counting error")
                    total_bus = result[0].total_bus
                    total_capacity = result[0].total_capacity

                    sqls = "SELECT count(*) as total_routes from ROUTES;"
                    db.query(sqls, (err, result) => {
                        if (err) console.log("Routes counting error")
                        total_routes = result[0].total_routes

                        res.render("html/admin/report.ejs", { data: { student_count: student_count, faculty_count: faculty_count, total_count: total_count, total_bus: total_bus, total_capacity: total_capacity, total_routes: total_routes } })
                    })
                })
            });
        });
    }
    else {
        res.render("html/admin/home.ejs")
    }






})

app.get("/admin/report_download", function (req, res) {
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



//========================================Passenger Signup=============================================


app.get("/passenger/register", function (req, res) {
    let sql = "SELECT route_no FROM ROUTES ;";
    db.query(sql, (err, result) => {
        if (err) throw err;
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

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lofilinesnmamit@gmail.com',
            pass: 'drsvtmzkofrvfxkj'
        }
    });

    var mailOptions = {
        from: 'lofilinesnmamit@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: x
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.render("html/otp.ejs")
});

app.post("/passenger/verify", (req, res) => {
    otp = req.body.digits
    console.log(otp)

    if (otp === x) {
        var sqls = "SELECT * FROM ROUTES where route_no='" + route_no + "';";
        db.query(sqls, (err, result) => {
            if (err) console.log("Error occured wile fetching routes");
            var money = result[0].fees;


            sqls = "INSERT INTO PASS values(" + money + ", " + passid + ", 0);"
            db.query(sqls, (err, result) => {
                if (err) throw err;
                console.log("Successfully Pass inserted")

                sqls = "SELECT * from BUS where route_no='" + route_no + "';"
                db.query(sqls, (err, result) => {
                    if (err) console.log("Error occured while fetchng Bus no")
                    bus_no = result[0].bus_no

                    sqls = "INSERT INTO PASSENGER VALUES('" + addresss + "','" + usn + "','" + fname + "','" + phoneno + "','" + email + "','" + designation + "','" + password + "'," + passid + "," + bus_no + ");";
                    db.query(sqls, (err, result) => {
                        if (err) throw err
                        res.send("Success bro")
                    })
                })
            })

        });
    }
    else {
        res.send("Wrong OTP bro")
    }
})

app.get("/forgot-password", function (req, res) {
    res.render("html/forgot-password.ejs");
});



//========================================== Passenger pages=========================================

//------------------Home-----------

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
        res.render("html/admin/home.ejs")
    }
});

//---------------Profile----------

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
        res.render("html/admin/home.ejs")
    }
});

app.get("/passenger/application", function (req, res) {
    session = req.session;

    let sql = "SELECT * FROM PASSENGER,PASS,BUS,ROUTES where PASS.pass_id=PASSENGER.pass_id AND BUS.bus_no=PASSENGER.bus_no AND BUS.route_no=ROUTES.route_no AND passenger_email='" + session.userid + "';";
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.render("html/passenger/apply.ejs", { data: { result: result } });
    });
});

//-------------Route details-----

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
        res.render("html/admin/home.ejs")
    }
});



//=============================================PORT================================================

app.listen("3001", function () {
    console.log("Hey iM listening: 3000")
});
