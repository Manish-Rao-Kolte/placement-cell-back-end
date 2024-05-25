import { Router } from "express";
import {
  registerStudent,
  removeStudent,
} from "../../../controllers/student.controller.js";
import { validateJwt } from "../../../middlewares/auth.middleware.js";

const studentRouter = Router();

studentRouter.post("/register", validateJwt, registerStudent);
studentRouter.get("/remove", validateJwt, removeStudent);

export default studentRouter;
