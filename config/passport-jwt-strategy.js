const passport=require('passport');
const passjwt=require('passport-jwt').Strategy;
const jwtextract=require('passport-jwt').ExtractJwt;
const Register=require("../models/Admin/admin");
const Manager=require("../models/Manager/manager");
const User=require('../models/USER/user');

var opts={
    jwtFromRequest : jwtextract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'api'
}

var manopts={
    jwtFromRequest : jwtextract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'managerData'
}

var useropts={
    jwtFromRequest : jwtextract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'user'
}

passport.use(new passjwt(opts , 
    async function (record , done) {
        let checkAdmin = await Register.findById(record.data._id);
        if(checkAdmin)
        {
            return done(null , checkAdmin);
        }
    }
));

passport.use("manager",new passjwt(manopts , 
    async function (record , done) {
        let checkmanager = await Manager.findById(record.manager._id);
        if(checkmanager)
        {
            return done(null , checkmanager);
        }
        else
        {
            return done(null , false);
        }
    }
));

passport.use("userData",new passjwt(useropts , 
    async function (record , done) {
        let checkuser = await User.findById(record.user._id);
        if(checkuser)
        {
            return done(null , checkuser);
        }
        else
        {
            return done(null , false);
        }
    }
));

passport.serializeUser(function(user,done){
    return done(null , user.id);
});

passport.deserializeUser( async function(id , done){
    let recheck = await Register.findById(id);
    if(recheck)
    {
        return done(null , recheck);
    }
    else
    {
        return done(null , false);
    }
})

