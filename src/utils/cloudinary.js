//IT WILL UPLOAD THE FILE FROM SERVER TO THE CLOUDINARY


import { v2 as cloudinary } from "cloudinary";
import {fs} from "fs"; //file system

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_KEY_SECRET 
});

const uploadOnCloudinary=async (localFilePath)=>{
    try{
        if(!localFilePath)return null
      const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("file is uploaded on cloudinary",response.url);
        return response
    }catch (error){
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation operation got failed
        return null;
    }
}

export {uploadOnCloudinary}

/*cloudinary.v2.uploader.upload(
    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
              { public_id: 'shoes'},
              function(error,result){console.log(result);}
           );*/