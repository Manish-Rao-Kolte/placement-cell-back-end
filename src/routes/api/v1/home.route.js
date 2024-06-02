import { Router } from "express";
import { renderHome } from "../../../controllers/home.controller.js";
import { validateJwt } from "../../../middlewares/auth.middleware.js";

const homeRouter = Router();

homeRouter.get("/", validateJwt, renderHome);
homeRouter.post("/", validateJwt, renderHome);

export default homeRouter;
