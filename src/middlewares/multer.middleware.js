import multer from "multer";

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/temp")
    },
    filename:function (req,file,cb){ //cb=callback
       // const uniqueSuffix=date.now() + '-' + Math.round(Math.random()*1E9)      used to change the suffix and have the unique name
        cb(null,file.fieldname + '-' + uniqueSuffix)
    }
})

 export const upload=multer({
    storage:storage
})