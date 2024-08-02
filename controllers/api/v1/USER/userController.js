const User=require("../../../../models/USER/user");

const bcrypt=require('bcrypt');

const jwtData=require("jsonwebtoken");

const fs=require('fs');

const path = require('path');

module.exports.registration=async(req,res)=>{
    // console.log(req.body);
    try
    {

        let checkmail=await User.findOne({email:req.body.email});
        if(checkmail)
        {
            return res.status(400).json({msg:'Email is alredy registered',staus:0})
        }
        else
        {
            if(req.body.password==req.body.confirm_password)
            {
                req.body.password= await bcrypt.hash(req.body.password,10);
                let userimg='';
                if(req.file)
                {
                    userimg = User.imagepath+'/'+req.file.filename;
                }
                // console.log(req.file);
                req.body.image=userimg;
                let userdata=await User.create(req.body);
                if(userdata)
                {
                    return res.status(200).json({msg:'registered',status:1,data:userdata});
                }
                else
                {
                    return res.status(400).json({msg:'Failed',status:0});
                }
            }
            else
            {
                return res.status(400).json({msg:'password is wrong',status:0}); 
            }
        }
    }
    catch(err)
    {
        return res.status(400).json({msg:'something wrong',status:0});   
    }
}

module.exports.login=async(req,res)=>{
    try
    {
        let checkmail=await User.findOne({email:req.body.email});
        if(checkmail)
        {
            if(await bcrypt.compare(req.body.password,checkmail.password))
            {
                let token=jwtData.sign({user:checkmail},'user',{expiresIn:'1h'})
                return res.status(200).json({msg:'login succesfully',status:1,token:token});
            }
        }
        else
        {
            return res.status(400).json({msg:'email not found',status:0});
        }
    }
    catch(err)
    {
        return res.status(400).json({msg:'something wrong',status:0});
    }
}

module.exports.profile=async(req,res)=>{
        // console.log(req.user);
        // let userdata = await User.find({});
        // console.log(userdata);
        return res.status(200).json({msg:'your profile',status:1,data:req.user});
   
}

module.exports.editprofile=async(req,res)=>{
    // console.log(req.body);
    // console.log(req.file);
    try
    {
        let olduserdata=await User.findById(req.params.id);
        if(req.file)
        {
            var fullpath=path.join(__dirname,'../../../..',olduserdata.image);
            // console.log(fullpath);
            try
            {
                await fs.unlinkSync(fullpath);
            }
            catch(err)
            {
                console.log(err);
            }
            req.body.image=User.imagepath+'/'+req.file.filename;
            let editdata=await User.findByIdAndUpdate(req.params.id,req.body);
            // console.log(editdata);
            if(editdata)
            {
                return res.status(200).json({msg:'Edit record',status:1})
            }
            else
            {
                return res.status(400).json({msg:'record not found',status:0})
            }
        }
        else
        {
            var imgpath='';
            if(olduserdata)
            {
                imgpath=olduserdata.image;
            }
            req.body.image=imgpath;
            var editdt =await User.findByIdAndUpdate(req.params.id,req.body);
            if(editdt)
            {
                return res.status(200).json({msg:"Edit record",staus:1,data:editdt});
            }
            else
            {
                return res.status(200).json({msg:"record not found",staus:0});
            }
        }
    }
    catch(err)
    {
        return res.status(400).json({msg:'something wrong',status:0});
    }
}

module.exports.alluserdata=async(req,res)=>{
    try
    {
        let alluserdata=await User.find({});
        return res.status(200).json({msg:'All User',status:1,data:alluserdata});
    }
    catch(err)
    {
        return res.status(400).json({msg:'something wrong',status:0});
    }
}