import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { registerUser } from "../controllers/user.controller.js";

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

export default router;