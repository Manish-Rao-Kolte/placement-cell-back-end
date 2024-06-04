import { Interview } from "../models/interview.model.js";
import { Student } from "../models/student.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//create controller to register or add bew student in database
const registerStudent = asyncHandler(async (req, res) => {
   //check if user/employee is loggedIn and session is active
   // if (!req?.user) {
   //   throw new apiError(401, "Unauthorized access!");
   // }
   //get student data from client
   const { batch, fullName, email, phone, college, DSA, WebD, React } =
      req.body;
   const courseScores = {
      DSA,
      WebD,
      React,
   };
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
   return res.status(201).redirect("back");
   // .json(new apiResponse(201, student, "Student created successfully!"));
});

//create controller to remove student from database
const removeStudent = asyncHandler(async (req, res) => {
   //get the data from client
   const { _id } = req.params;
   //check data validation
   if (!_id) {
      throw new apiError(400, "Invalid student id!");
   }
   //find student and remove from db
   const student = await Student.findByIdAndDelete(_id);
   // const student = await Student.findById(_id);
   if (!student) {
      throw new apiError(404, "Student not found!");
   }
   //remove student from allocated interviews
   student.interviewList.map(async (interview_id) => {
      // const interview = await Interview.findById(interview_id);
      // const newList = interview.studentList.filter(
      //    (data) => data?._id === student._id
      // );
      // interview.studentList = [...newList];
      // await interview.save({ validateBeforeSave: false });
      await Interview.findByIdAndDelete(interview_id);
   });
   //send response
   return res.status(200).redirect("back");
   // .json(new apiResponse(200, {}, "Student removed successfully!"));
});

//create a controller function to update student's status in db.
const updateStudent = asyncHandler(async (req, res) => {
   //get data from client
   //check for data validation
   //fetch user from db and update user
   //send response or redirect
   const { status } = req.body;
   const { _id } = req.params;
   if (status?.trim() === "") {
      throw new apiError(400, "Status data is required!");
   }
   const student = await Student.findByIdAndUpdate(
      _id,
      {
         status,
      },
      {
         new: true,
      }
   );
   return res.status(200).redirect("back");
});

//controller to render add student page
const renderAddStudent = asyncHandler(async (req, res) => {
   return res.render("add_student", { loggedIn: true });
});

export { registerStudent, removeStudent, renderAddStudent, updateStudent };
