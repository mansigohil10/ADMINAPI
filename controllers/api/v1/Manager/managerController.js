const Manager=require('../../../../models/Manager/manager');

const bcrypt=require('bcrypt');

const jwtData=require("jsonwebtoken");

const path = require('path');

const fs=require('fs');

const nodemailer=require('nodemailer');

const Admin=require("../../../../models/Admin/admin");


module.exports.add_manager=async(req,res)=>{
    // console.log(req.body);
    // console.log(req.file);
    try
    {
        let checkmail=await Manager.findOne({email:req.body.email});
        if(checkmail)
        {
            return res.status(200).json({msg:"email alredy registered",status:0});
        }
        else
        {
            if(req.body.password == req.body.confirm_password)
            {
                let pass=req.body.password;
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                        user: "mansigohil2003@gmail.com",
                        pass: "dyybageitaiqurwt",
                    },
                });

                const info = await transporter.sendMail({
                    from: 'mansigohil2003@gmail.com', // sender address
                    to: `${req.body.email}`, // list of receivers
                    subject: "Manager predections", // Subject line
                    text: "your details", // plain text body
                    html: `<p>${req.body.email}</p><p>${pass}</p>` // html body
                });
                
                req.body.password= await bcrypt.hash(req.body.password,10);
                let maimage='';
                if(req.file)
                {
                    maimage=Manager.imagepath+'/'+req.file.filename;
                }
                req.body.image=maimage;
                req.body.adminId=req.user.id;
                var managerdata= await Manager.create(req.body);
                // console.log(managerdata);
                if(managerdata)
                {
                    let adminData=await Admin.findById(req.user.id);
                    adminData.maIds.push(managerdata.id);
                    await Admin.findByIdAndUpdate(req.user.id,adminData);

                    return res.status(200).json({msg:"login succesfully",status:1,data:managerdata});
                }
                else
                {
                    return res.status(400).json({msg:"login not succesfully",status:0});
                }
            }
            else
            {
                return res.status(200).json({msg:"password are not same",status:0});
            }
        }  
    }
    catch(err)
    {
        return res.status(400).json({msg:"something Wrong",status:0});
    }
}

module.exports.login=async(req,res)=>{
    // console.log(req.body);
    try
    {
        let checkmail=await Manager.findOne({email:req.body.email})
        if(checkmail)
        {
            if(await bcrypt.compare(req.body.password,checkmail.password))
            {
                let token=jwtData.sign({manager:checkmail },"managerData",{expiresIn:'1h'})
                return res.status(200).json({msg:"login succesfully",status:1,token:token});
            }
            
        }
        else
        {
            return res.status(400).json({msg:"email not found",status:0});
        }
        
    }
    catch(err)
    {
        return res.status(400).json({msg:"something Wrong",status:0});
    }
}

module.exports.profile=async(req,res)=>{
    // console.log(req.user);
    let manprof=await Manager.findById(req.user.id).populate('adminId').exec();
    return res.status(200).json({msg:"details is here",status:1,data:manprof});
}

module.exports.editProfile=async(req,res)=>{
    // console.log(req.body);
    try
    { 
        let oldamanagerdt = await Manager.findById(req.params.id);
        if(req.file)
        {
            var fullpath = path.join(__dirname,'../../../..',oldamanagerdt.image);
            try{
                await fs.unlinkSync(fullpath);
            }
            catch(err){
                console.log(err);
            }
            req.body.image = Manager.imagepath+'/'+req.file.filename;
            var editdt =await Manager.findByIdAndUpdate(req.params.id,req.body);
            if(editdt)
            {
                return res.status(200).json({msg:"Record is edit",staus:1});
            }
            else
            {
                return res.status(200).json({msg:"not record found",staus:0});
            }
        }
        else
        {
            var imgpath='';
            if(oldamanagerdt)
            {
                imgpath=oldamanagerdt.image;
            }
            req.body.image=imgpath;
            var editdt =await Manager.findByIdAndUpdate(req.params.id,req.body);
            if(editdt)
            {
                return res.status(200).json({msg:"Record is edit",staus:1});
            }
            else
            {
                return res.status(200).json({msg:"not record found",staus:0});
            }
        }
        // console.log(req.params.id);
        // console.log(req.body);
       
    }
    catch(err){
        return res.status(400).json({msg:"something Wrong",status:0});
    }
}