import { Router } from "express";
import {
      generateCSV,
      renderHome,
} from "../../../controllers/home.controller.js";
import { validateJwt } from "../../../middlewares/auth.middleware.js";

const homeRouter = Router();

homeRouter.get("/", validateJwt, renderHome);
homeRouter.get("/generate-csv", generateCSV);
homeRouter.post("/", validateJwt, renderHome);

export default homeRouter;
