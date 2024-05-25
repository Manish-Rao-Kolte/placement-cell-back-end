import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../../../controllers/user.controller.js";
import { validateJwt } from "../../../middlewares/auth.middleware.js";

const router = Router();

//unsecured routes
// router.route("/register").post(registerUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

//secured routes
router.get("/logout", validateJwt, logoutUser);
router.get("/refresh-token", refreshAccessToken);

export default router;
