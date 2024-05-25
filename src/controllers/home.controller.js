import { Student } from "../models/student.model";
import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

const renderHome = asyncHandler(async (req, res) => {
  const studentList = await Student.find();
  if (!studentList) {
    throw new apiError(500, "No data available or unable to fetch!");
  }
  /*
   Some work is pending here
  */
});

export { renderHome };
