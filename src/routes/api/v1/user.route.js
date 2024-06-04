import { Router } from "express";
import {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   renderLoginPage,
   renderSignupPage,
} from "../../../controllers/user.controller.js";
import { validateJwt } from "../../../middlewares/auth.middleware.js";

const userRouter = Router();

//unsecured routes
// router.route("/register").post(registerUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/login-page", renderLoginPage);
userRouter.get("/signup-page", renderSignupPage);

//secured routes
userRouter.get("/logout", validateJwt, logoutUser);
userRouter.get("/refresh-token", refreshAccessToken);

export default userRouter;
