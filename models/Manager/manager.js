const mongoose=require('mongoose');

const multer=require('multer');

const path=require('path');

const imgpath="/uploads/managerImage";


const ManagerSchema=mongoose.Schema({
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
    adminId :{
        type :mongoose.Schema.Types.ObjectId,
        ref : "AdminApi"
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

ManagerSchema.statics.uploadImage=multer({storage:storage}).single('image');
ManagerSchema.statics.imagepath=imgpath;


const Manager = mongoose.model('Manager',ManagerSchema);

module.exports=Manager;