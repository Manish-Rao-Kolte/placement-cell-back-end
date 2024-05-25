import { Student } from "../models/student.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createStudent = asyncHandler(async (req, res) => {
  //check if user/employee is loggedIn and session is active
  if (!req?.user) {
    throw new apiError(401, "Unauthorized access!");
  }
  //get student data from client
  const { batch, fullName, email, phone, college, courseScores } = req.body;
  //check all required fileds
  if (
    [
      batch.trim(),
      fullName.trim(),
      email.trim(),
      phone.trim(),
      college.trim(),
      courseScores,
    ].some((data) => data === "")
  ) {
    throw new apiError(400, "All fields marked with * are required!");
  }
  //check if student is already present
  const existingStudent = await Student.findOne({
    $or: [{ email }, { phone }],
  });
  if (existingStudent) {
    throw new apiError(409, "Student already exists!");
  }
  //create student data in db
  const student = await Student.create({
    batch,
    fullName,
    email,
    phone,
    college,
    courseScores,
  });

  if (!student) {
    throw new apiError(500, "Something went wrong while creating student!");
  }
  //send response to client
  return res
    .status(201)
    .json(new apiResponse(201, student, "Student created successfully!"));
});

const removeStudent = asyncHandler(async (req, res) => {
  //check if client/employee is logged in
  if (!req.user) {
    throw new apiError(401, "Unauthorized access!");
  }
  //get the data from client
  const { student_id } = req.query;
  //check data validation
  if (!student_id) {
    throw new apiError(400, "Invalid student id!");
  }
  //find student and remove from db
  const student = await Student.findByIdAndDelete(student_id);
  if (!student) {
    throw new apiError(404, "Student not found!");
  }
  //send response
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Student removed successfully!"));
});

export { createStudent, removeStudent };
