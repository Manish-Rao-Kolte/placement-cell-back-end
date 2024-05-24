import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  //get data from user/client
  //   console.log(req);
  const { username, fullName, empId, email, password } = req.body;
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
  });

  const createdUser = await User.findById(user._id).select("-password");
  //check if user created successfully
  if (!createdUser) {
    throw new apiError(500, "Something went wrong white registering user!");
  }
  //send response
  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User registered successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get data from user/client
  const { username, password } = req.body;
  //check if required data is present
  if ([username, password].some((data) => data?.trim() === "")) {
    throw new apiError(400, "Fields marked with * are required!");
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
  //send response to user
  return res
    .status(201)
    .json(
      new apiResponse(
        201,
        await User.findById(existingUser._id).select("-password"),
        "Signed in successfully!"
      )
    );
});

export { registerUser, loginUser };
