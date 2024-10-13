import { APIerror } from "../utils/APIerror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { user as User } from "../models/User.model.js"; // Changed the import name to User
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APIresponse } from "../utils/APIresponse.js";

 //get user details from frontend 
   //validation - not empty
   //check if user already exists: by username or email
   //check for images,check for avatar
   //upload them to cloudinary,avatar
   //create user object - create entry in db
   //remove password and refresh token field from response
   //check for user creation
   //return res


const registerUser = asyncHandler(async (req, res) => {
    // Get user details from the frontend
    const { fullname, email, username, password } = req.body;
    console.log("email:", email);

    // Validation: check if all fields are filled
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new APIerror(400, "All fields are required");
    }

    // Check if the user already exists by username or email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existedUser) {
        throw new APIerror(409, "User with email or username already exists");
    }

    // Check for uploaded images (avatar and cover image)
   //const avatarLocalPath = req.files?.avatar?.path;
   // const coverImageLocalPath = req.files?.coverImage?.path;

    let coverImageLocalPath;
    if(req.files &&  Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path;
    }

    let avatarLocalPath;
    if(req.files && Array.isArray(req.files.avatar)&&req.files.avatar.length>0){
        avatarLocalPath=req.files.avatar[0].path;
    }


   /* if (!avatarLocalPath) {
        throw new APIerror(400, "Avatar file is required");
    }*/

    // Upload avatar and cover image to Cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    /*if (!avatar) {
        throw new APIerror(400, "Avatar upload failed");
    }*/

    // Create a new user object and save it in the database
    const newUser = await User.create({ // Renamed variable to newUser
        fullname,
        avatar: avatar?.url||"",
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Fetch the created user and exclude password and refreshToken fields
    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new APIerror(500, "Something went wrong while registering user");
    }

    // Return the created user as a response
    return res.status(201).json(
        new APIresponse(201, createdUser, "User registered successfully")
    );
});

export { registerUser };
