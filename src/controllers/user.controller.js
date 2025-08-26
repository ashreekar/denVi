import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIerror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloundinary.js"
import { ApiResponse } from "../utils/APIResponse.js"
import jwt from "jsonwebtoken"


const generateAcceasAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accestokenHere = await user.generateAcceasToken()
        const refreshtockenHere = await user.generateRefreshToken()

        user.refreshtocken = refreshtockenHere;
        await user.save({ validateBeforeSave: false })

        return { accestokenHere, refreshtockenHere }

    } catch (error) {
        throw new ApiError(500, "Somethingwent wrong while generating refresh and acces token")
    }
}

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

const loginUser = asyncHandler(async (req, res) => {
    // ToDos
    // 1) get user details
    // 2) check for blancks
    // 3) check user exists
    // 4) not exists warn
    // 5) check password from bcrypt
    // 5) send accceas and ref tokn
    // 7) send cookies
    console.log("REQ BODY --->", req.body);
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or password required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isValidPassword = await user.isPasswordCorrect(password);

    if (!isValidPassword) {
        throw new ApiError(401, "Invalid password");
    }

    const { accestokenHere, refreshtockenHere } = await generateAcceasAndRefreshToken(user._id);

    const loggeduser = await User.findById(user._id).
        select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accestokenHere, options)
        .cookie("refreshToken", refreshtockenHere, options)
        .json(
            new ApiResponse(200, {
                user: loggeduser, accestokenHere, refreshtockenHere
            }),
            "Login sucessfull"
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshtocken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged out"))

})

const refreshAcceasToken = asyncHandler(async (req, res) => {
    try {
        const token = req.cookies?.refreshToken || req.body.refreshToken

        if (!token) {
            throw new ApiError(400, "Unauthorised request");
        }

        const decodedInfo = await jwt.verify(token, process.env.REFRESH_TOCKEN_SECRET);

        const user = await User.findById(decodedInfo?._id)

        if (!user) {
            throw new ApiError(401, "Unauthorised acceas")
        }

        if (token !== user?.refreshtocken) {
            throw new ApiError(400, "Refresh token is expired or used");
        }

        const { accestokenHere, refreshtockenHere } = await generateAcceasAndRefreshToken(user?._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accestokenHere, options)
            .cookie("refreshToken", refreshtockenHere, options)
            .json(
                new ApiResponse(200, {
                    user: user.fullName
                }),
                "Login sucessfull"
            )
    } catch (error) {
        throw new ApiError(505, "Something went wrong while generating refresh token");
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordcorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordcorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new ApiResponse(200, {}, "Password changed sucessfully"));
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User doesnot exists");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "OK"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email
            }
        },
        { new: true }
    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200, user, "Account details updated sucessfully"));
})

export { registerUser, loginUser, logoutUser, refreshAcceasToken, changeCurrentPassword, getCurrentUser };