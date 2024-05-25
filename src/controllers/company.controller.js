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
    address: address || null,
    phone: phone || null,
  });
  if (!company) {
    throw new apiError(500, "Something went wrong while creating company!");
  }
  return res
    .status(201)
    .json(new apiResponse(201, company, "Company registered successfully!"));
});
const removeCompany = asyncHandler(async (req, res) => {});

export { registerCompany, removeCompany };
