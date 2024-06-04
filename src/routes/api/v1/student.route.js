import { Router } from "express";
import {
   registerStudent,
   removeStudent,
   renderAddStudent,
   updateStudent,
} from "../../../controllers/student.controller.js";
import { validateJwt } from "../../../middlewares/auth.middleware.js";

const studentRouter = Router();

studentRouter.post("/register", validateJwt, registerStudent);
studentRouter.post("/update/:_id", validateJwt, updateStudent);
studentRouter.get("/remove/:_id", validateJwt, removeStudent);
studentRouter.get("/registration-form", validateJwt, renderAddStudent);

export default studentRouter;
