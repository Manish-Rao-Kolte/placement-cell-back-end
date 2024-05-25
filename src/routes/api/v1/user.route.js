import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../../../controllers/user.controller.js";
import { validateJwt } from "../../../middlewares/auth.middleware.js";

const userRouter = Router();

//unsecured routes
// router.route("/register").post(registerUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

//secured routes
userRouter.get("/logout", validateJwt, logoutUser);
userRouter.get("/refresh-token", refreshAccessToken);

export default userRouter;
