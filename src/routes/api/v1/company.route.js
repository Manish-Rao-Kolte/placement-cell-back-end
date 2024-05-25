import { Router } from "express";
import { validateJwt } from "../../../middlewares/auth.middleware.js";
import { registerCompany } from "../../../controllers/company.controller.js";

const companyRouter = Router();

companyRouter.post("/register", validateJwt, registerCompany);

export default companyRouter;
