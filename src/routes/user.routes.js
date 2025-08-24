import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { loginUser, registerUser, logoutUser } from "../controllers/user.controller.js";
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

export default router;