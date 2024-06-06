import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { cookieOptions } from "../constants.js";
import jwt from "jsonwebtoken";

const renderLoginPage = asyncHandler(async (req, res) => {
   if (req.user) {
      return res.redirect("/api/v1/");
   }
   console.log("working2");
   return res.status(200).render("sign_in");
});

const renderSignupPage = asyncHandler(async (req, res) => {
   if (req.user) {
      return res.redirect("/api/v1/");
   }
   return res.status(200).render("sign_up");
});

//custome function to generate access and refresh token to increase reusability
const generateAccessAndRefreshToken = async (user) => {
   try {
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return {
         accessToken,
         refreshToken,
      };
   } catch (error) {
      throw new apiError(500, "something went wrong while generating tokens!");
   }
};

//create controller function to handle new user registration
const registerUser = asyncHandler(async (req, res) => {
   //get data from user/client
   //   console.log(req);
   const { email, username, fullName, empId, password } = req.body;
   //check if all required data is present
   if (
      [username, fullName, empId, email, password].some(
         (data) => data?.trim() === ""
      )
   ) {
      throw new apiError(400, "All fields marked with * are required!");
   }
   //check if user is already registered
   const existingUser = await User.findOne({
      $or: [{ username }, { email }],
   });

   if (existingUser) {
      throw new apiError(
         409,
         "User with given username or email already exists!"
      );
   }
   //create user
   const user = await User.create({
      username,
      fullName,
      empId,
      email,
      password,
      refreshToken: "",
   });

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );
   //check if user created successfully
   if (!createdUser) {
      throw new apiError(500, "Something went wrong white registering user!");
   }
   //send response
   return res.status(201).redirect("/api/v1/");
   // .json(new apiResponse(201, createdUser, "User registered successfully!"));
});

//create controller function to handle existing user login
const loginUser = asyncHandler(async (req, res) => {
   //get data from user/client
   const { username, password } = req.body;
   //check if required data is present
   if ([username, password].some((data) => data?.trim() === "")) {
      throw new apiError(400, "Username and password are required!");
   }
   //find user with given data
   const existingUser = await User.findOne({
      $or: [{ username }, { email: username }],
   });
   //if not found throw error
   if (!existingUser) {
      throw new apiError(404, "User not found, sign up instead!");
   }
   //if found match the password
   const isPasswordCorrect = await existingUser.isPasswordCorrect(
      password?.trim()
   );
   //if not matched throw error
   if (!isPasswordCorrect) {
      throw new apiError(401, "Wrong username or password!");
   }
   //generate access and refresh token for session
   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      existingUser
   );
   //get updated data to pass in response
   const user = await User.findById(existingUser._id).select(
      "-password -refreshToken"
   );

   //send response to user and set tokens in browser cookies
   //   const options = {
   //     httpOnly: true,
   //     secure: true,
   //   };
   return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .redirect("/api/v1/");
   // .json(
   //   new apiResponse(
   //     201,
   //     {
   //       user,
   //       accessToken,
   //       refreshToken,
   //     },
   //     "User logged in successfully!"
   //   )
   // );
});

//create controller function to handle existing user lgout
const logoutUser = asyncHandler(async (req, res) => {
   //fetch user from db and reset refreshToken
   const user = await User.findByIdAndUpdate(
      req.user._id,
      { refreshToken: null },
      {
         new: true,
      }
   );
   //clear cookie form browser and send response
   //   const options = {
   //     httpOnly: true,
   //     secure: true,
   //   };
   return res
      .status(201)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .redirect("/api/v1/users/login-page");
   // .json(new apiResponse(201, {}, "User logged out successfully!"));
});

//create funtion to handle token expiry
const refreshAccessToken = asyncHandler(async (req, res) => {
   //fetch token from user end
   const fetchedRefreshToken =
      req.cookies?.refreshToken ||
      req.body?.refreshToken ||
      req.header("Authorization").replace("Bearer ", "");
   if (!fetchedRefreshToken) {
      throw new apiError(401, "Invalid refresh token!");
   }
   try {
      //verify and decode token to get user id
      const decodedToken = jwt.verify(
         fetchedRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decodedToken._id);
      if (!user) {
         throw new apiError(401, "Invalid refresh token!");
      }
      //compare refresh token if valid
      if (fetchedRefreshToken !== user.refreshToken) {
         throw new apiError(401, "Invalid refresh token!");
      }
      //genrate new access and refresh token
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
         user
      );
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      //send response and set seesion cookies again
      return res
         .status(201)
         .cookie("accessToken", accessToken, cookieOptions)
         .cookie("refreshToken", refreshToken, cookieOptions)
         .json(
            new apiResponse(
               201,
               {
                  accessToken,
                  refreshToken,
               },
               "Tokens refreshed successfully!"
            )
         );
   } catch (error) {
      throw new apiError(401, error?.message || "Invalid refresh token!");
   }
});

export {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   renderLoginPage,
   renderSignupPage,
};
