import { APIerror } from "../utils/APIerror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { user } from "../models/User.model.js";
//import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APIresponse } from "../utils/APIresponse.js";

const registerUser=asyncHandler(async (req,res)=>{
   //get user details from frontend 
   //validation - not empty
   //check if user already exists: by username or email
   //check for images,check for avatar
   //upload them to cloudinary,avatar
   //create user object - create entry in db
   //remove password and refresh token field from response
   //check for user creation
   //return res

    const {fullname,email,username,password}=req.body
    console.log("email:",email);

    if(
        [fullname,email,username,password].some((field)=>
        field?.trim()==="")
    ){
        throw new APIerror(400,"All field are required")
    }
   const existedUser= user.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new APIerror(409,"user with email or username already exist")
    }
   const avatarLocalPath= req.files?.avatar[0]?.path;
   const coverImageLocalPath=req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new APIerror(400,"Avatar file is required")
   }

   const avatar=await uploadOnCloudinary(avatarLocalPath)
   const coverImage= await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new APIerror(400,"Avatar file is required")
   }

  const user=await user.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase(),
   })

  const createdUser=await user.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new APIerror(500,"something went wrong while registering user");
  }

  return res.status(201).json(
    new APIresponse(200,createdUser,"User registered successfully")
  )
})

export {registerUser}