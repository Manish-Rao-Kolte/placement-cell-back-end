import { Router } from "express";
import { validateJwt } from "../../../middlewares/auth.middleware.js";
import {
  allocateInterview,
  renderInterviews,
  scheduleInterview,
} from "../../../controllers/interview.controller.js";

const interviewRouter = Router();

interviewRouter.get("/", validateJwt, renderInterviews);

interviewRouter.post("/schedule", validateJwt, scheduleInterview);
interviewRouter.post("/allocate", validateJwt, allocateInterview);

export default interviewRouter;
