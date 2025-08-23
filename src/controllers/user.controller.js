import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIerror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloundinary.js"
import { ApiResponse } from "../utils/APIResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    // controller for testing first output for route
    // res.status(200).json({
    //     message: "Tea kudi code madu"
    // })

    // register user
    // 1) getUserdetails from frontend (postman)
    // 2) validation needs to be done -- not all empty
    // 3) check if user already exists -- username and email
    // 4) files needed check for images , check for avtar
    // 5) upload them to cloudinary
    // 6) check upload status
    // 7) create user object - creation call create enrty in db
    // 8) remove password and refreshtokem field from response
    // 9) check user create response
    // 10) if created return it.

    const { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        // operator
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // images handling
    // .files added by multer
    const avaterLocalPath = req.files?.avatar[0]?.path
    // const coverLocalPath = req.files?.coverImage[0]?.path

    let coverLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverLocalPath = req.files.coverImage[0].path
    }

    if (!avaterLocalPath) {
        throw new ApiError(400, "Avtar file is required");
    }

    // upload on cloudinary
    const avatar = await uploadOnCloudinary(avaterLocalPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avtar file is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })

    // find the user one last time excluding thes e params
    const createdUser = await User.findById(user._id).select(
        "-password -refreshtocken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User Added Sucessfully"))


})

export { registerUser };