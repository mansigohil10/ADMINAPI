const mongoose=require('mongoose');

const multer=require('multer');

const path=require('path');

const imgpath="/uploads/userImage";


const UserSchema=mongoose.Schema({
    username :{
        type : String
    },
    email :{
        type : String
    },
    password :{
        type : String
    },
    image :{
        type : String
    }
    
});

const storage=multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,"../..",imgpath))
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now())
    }
});

UserSchema.statics.uploadImage=multer({storage:storage}).single('image');
UserSchema.statics.imagepath=imgpath;


const User = mongoose.model('User',UserSchema);

module.exports=User;