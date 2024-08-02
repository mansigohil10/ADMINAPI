const mongoose=require('mongoose');

const multer=require('multer');

const path=require('path');

const imgpath="/uploads/adminImage";


const registerSchema=mongoose.Schema({
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
    },
    maIds :{
        type : Array,
        ref :"Manager"
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

registerSchema.statics.uploadImage=multer({storage:storage}).single('image');
registerSchema.statics.imagepath=imgpath;


const Register = mongoose.model('AdminApi',registerSchema);

module.exports=Register;