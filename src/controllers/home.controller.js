import { Student } from "../models/student.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const renderHome = asyncHandler(async (req, res) => {
  const studentList = await Student.find();
  if (!studentList) {
    throw new apiError(500, "No data available or unable to fetch!");
  }
  /*
   Some work is pending here
  */
  return res.status(200).render("home", { studentList });
});

export { renderHome };
