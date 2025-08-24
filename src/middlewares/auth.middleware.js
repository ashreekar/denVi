import { User } from "../models/user.model";
import { ApiError } from "../utils/APIerror";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accestokenHere || req.header("Authorization")?.replace("Bearer", "")

        if (!token) {
            throw new ApiError(401, "Unauthorised request");
        }

        // ask jwt to check token is right
        const decodedInfo = await jwt.verify(token, process.env.ACCESS_TOCKEN_SECRET)

        const user = await User.findById(decodedInfo?._id).select("-password -refreshToken");

        if (!user) {
            // TODO : discuss about frontend
            throw new ApiError(401, "Invalid acceas token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid acces token")
    }
});