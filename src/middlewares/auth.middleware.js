import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";

export const validateJwt = asyncHandler(async (req, res, next) => {
  try {
    //get token from cookies and validate
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).redirect("/api/v1/users/login-page");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //get id from token and find user from db
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(401).redirect("/api/v1/users/login-page");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, error.message || "Invalid access token!");
  }
});
