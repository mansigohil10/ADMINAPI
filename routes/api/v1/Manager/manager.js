const express=require('express');

const routes=express.Router();

const managerController=require('../../../../controllers/api/v1/Manager/managerController');

const Manager=require('../../../../models/Manager/manager');

const passport=require('passport');

// add_manager
routes.post("/add_manager",passport.authenticate('jwt',{failureRedirect : "/admin/manager/faillogin"}),Manager.uploadImage,managerController.add_manager);

// login
routes.post("/login",managerController.login);

// faillogin
routes.get("/faillogin",async (req,res)=>{
    return res.status(200).json({msg :"Invalid login ",status : 0})
});

// profile
routes.get("/profile",passport.authenticate('manager',{failureRedirect : "/faillogin"}),managerController.profile);

// editProfile
routes.put("/editProfile/:id",passport.authenticate('manager',{failureRedirect : "/faillogin"}),Manager.uploadImage,managerController.editProfile)

module.exports=routes;