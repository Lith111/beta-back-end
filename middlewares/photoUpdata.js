const path = require("path");
const multer = require("multer");
// photo storage 
const photoStorage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,path.join(__dirname,"../images"));
    },
    filename:function(req,file,cb){
        if(file){
            cb(null,new Date().toString().replace(/:/g,"-") + file.originalname);
        }
        else{
            cb(null,false);
        }
    }
})
// phot ubload middlewares
const photoUpdate = multer({
    storage:photoStorage,
    fileFilter:function(req,file,cb){
        if(file.mimetype.startsWith("image")) {
            cb(null,true)
        }
        else{
            cb({message:"Unsupported file fourmat"},false)
        }

    },
    limits :{fileSize: 1024 * 1024 * 15} // 15m
})
module.exports = photoUpdate ;