import { Router } from "express";
import { validateJwt } from "../../../middlewares/auth.middleware.js";
import {
   registerCompany,
   renderAddCompany,
   renderCompaniesPage,
} from "../../../controllers/company.controller.js";

const companyRouter = Router();

companyRouter.get("/", renderCompaniesPage);
companyRouter.get("/add-company", renderAddCompany);
companyRouter.post("/register", validateJwt, registerCompany);

export default companyRouter;
