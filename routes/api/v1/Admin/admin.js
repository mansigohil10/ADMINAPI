const express=require('express');

const routes=express.Router();

const adminController=require("../../../../controllers/api/v1/ADMIN/adminController");

const Register=require("../../../../models/Admin/admin");

const passport = require('passport');

// registration
routes.post("/registration",Register.uploadImage,adminController.registration);

// login
routes.post("/login",adminController.login);

// profile
routes.get("/profile",passport.authenticate('jwt',{failureRedirect : "/admin/faillogin"}),adminController.profile);

// faillogin
routes.get("/faillogin",async (req,res)=>{
    return res.status(200).json({msg :"Invalid login",status : 0});
});

// editprofile
routes.put("/editprofile/:id",passport.authenticate('jwt',{failureRedirect : "/admin/faillogin"}),Register.uploadImage,adminController.editprofile);

// viewallManager
routes.get("/viewallManager",passport.authenticate('jwt',{failureRedirect :"/admin/faillogin"}),adminController.viewallManager)

// manager
routes.use("/manager",require('../../../../routes/api/v1/Manager/manager'));

module.exports=routes;