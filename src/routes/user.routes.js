import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { loginUser, registerUser, logoutUser, refreshAcceasToken, updateAccountDetails, updateAvatar, updateCoverImage, getCurrentUser, changeCurrentPassword, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// before /register add multer middleware

router.route("/register").post(
    // upload through multer
    upload.fields([{
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }]),
    registerUser);

//router.route("/login").post();

router.route("/login").post(loginUser)

// section secured routes
// verifyJWT next handles the next calling thet is logoutuser
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAcceasToken);

router.route('/changepassword').post(verifyJWT, changeCurrentPassword);

router.route('/current-user').get(verifyJWT, getCurrentUser);

router.route("/account/update").patch(verifyJWT, updateAccountDetails);

router.route("/avatar/update").patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
);

router.route("/cover/update").patch(verifyJWT, upload.single.apply("coverimage"), updateCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router;