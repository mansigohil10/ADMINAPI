const express=require('express');

const port=8001;

const path=require('path');

const app=express();

const db=require("./config/mongoose");

const passport=require('passport');

const pasportjwt=require('passport-jwt');

const jwtstrategy=require("./config/passport-jwt-strategy");

const session=require('express-session');

const fs=require('fs');

app.use(express.urlencoded());

app.use(session({
    name : "rnw",
    secret : "api",
    saveUninitialized : false,
    resave : true,
    cookie :{
        maxAge : 1000*60*100
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/admin",require("./routes/api/v1/Admin/admin"));

app.use("/uploads",express.static(path.join(__dirname,"uploads")));

app.use("/manager",require('./routes/api/v1/Manager/manager'));

app.use("/user",require('./routes/api/v1/User/user'));


app.listen(port,(err)=>{
    if(err)
    {
        console.log("something wrong");
    }
    console.log("connected",port);
})