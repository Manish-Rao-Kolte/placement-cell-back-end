import { Router } from "express";
import { validateJwt } from "../../../middlewares/auth.middleware.js";
import {
   removeInterview,
   renderInterviews,
   renderScheduleInterviewPage,
   scheduleInterview,
   updateInterviewResult,
} from "../../../controllers/interview.controller.js";

const interviewRouter = Router();

interviewRouter.get("/", validateJwt, renderInterviews);
interviewRouter.get("/schedule-interview-page", renderScheduleInterviewPage);

interviewRouter.post("/schedule", validateJwt, scheduleInterview);
interviewRouter.post("/update/:_id", updateInterviewResult);
interviewRouter.get("/remove/:_id", removeInterview);
// interviewRouter.post("/allocate", validateJwt, allocateInterview);

export default interviewRouter;
