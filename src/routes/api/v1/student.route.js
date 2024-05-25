import { Router } from "express";
import {
  createStudent,
  removeStudent,
} from "../../../controllers/student.controller.js";
import { validateJwt } from "../../../middlewares/auth.middleware.js";

const studentRouter = Router();

studentRouter.post("/create-student", validateJwt, createStudent);
studentRouter.get("/remove-student", validateJwt, removeStudent);

export default studentRouter;
