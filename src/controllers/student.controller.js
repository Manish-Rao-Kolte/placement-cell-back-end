import { Interview } from "../models/interview.model.js";
import { Student } from "../models/student.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerStudent = asyncHandler(async (req, res) => {
  //check if user/employee is loggedIn and session is active
  // if (!req?.user) {
  //   throw new apiError(401, "Unauthorized access!");
  // }
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
  //get the data from client
  const { student_id } = req.query;
  //check data validation
  if (!student_id) {
    throw new apiError(400, "Invalid student id!");
  }
  //find student and remove from db
  const student = await Student.findByIdAndDelete(student_id);
  // const student = await Student.findById(student_id);
  if (!student) {
    throw new apiError(404, "Student not found!");
  }
  //remove student from allocated interviews
  student.interviewList.map(async (interview_id) => {
    const interview = await Interview.findById(interview_id);
    const newList = interview.studentList.filter(
      (data) => data?._id === student._id
    );
    interview.studentList = [...newList];
    await interview.save({ validateBeforeSave: false });
  });
  //send response
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Student removed successfully!"));
});

const renderAddStudent = asyncHandler(async (req, res) => {
  return res.render("add_student", { loggedIn: true });
});

export { registerStudent, removeStudent, renderAddStudent };
