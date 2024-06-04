import { Company } from "../models/company.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerCompany = asyncHandler(async (req, res) => {
   //fetch data from client
   //check data validation
   //check if company is already present in db
   //create company data in db
   //send response
   const { name, companyCode, address, phone } = req.body;
   if ([name, companyCode].some((data) => data?.trim() === "")) {
      throw new apiError(400, "Name and company code are required!");
      // return res
      //   .status(400)
      //   .render("404_page", { message: "Name and company code are required!" });
   }
   const existingCompany = await Company.findOne({
      $or: [{ name }, { companyCode }],
   });
   if (existingCompany) {
      throw new apiError(400, "Company already exists!");
   }
   const company = await Company.create({
      name,
      companyCode,
      address: address === "" ? null : address,
      phone: phone === "" ? null : phone,
   });
   if (!company) {
      throw new apiError(500, "Something went wrong while creating company!");
   }
   return res.status(201).redirect("back");
   // .json(new apiResponse(201, company, "Company registered successfully!"));
});

const removeCompany = asyncHandler(async (req, res) => {});

const renderCompaniesPage = asyncHandler(async (req, res) => {
   const companiesList = await Company.find();
   return res.status(200).render("company", { companiesList });
});

const renderAddCompany = asyncHandler(async (req, res) => {
   return res.status(200).render("add_company");
});

export {
   registerCompany,
   removeCompany,
   renderCompaniesPage,
   renderAddCompany,
};
