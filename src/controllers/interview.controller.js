import { Interview } from "../models/interview.model.js";
import { Student } from "../models/student.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const renderInterviews = asyncHandler(async (req, res) => {
  //get interviewList from db
  const interviewList = await Interview.find();
  if (!interviewList) {
    throw new apiError(404, "Interview data not found!");
  }
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        interviewList,
        "Interview list fetched successfully!"
      )
    );
});

const scheduleInterview = asyncHandler(async (req, res) => {
  //fetch all the data from the client
  const { company, position, date, place } = req.body;
  //check data validation
  if (!company.trim() || !position.trim() || !date || !place.trim()) {
    throw new apiError(400, "All fields required!");
  }
  //check if interview already exixts
  const existingInterview = await Interview.findOne({
    $and: [{ company }, { position }, { date }, { place }],
  });
  if (existingInterview) {
    throw new apiError(400, "Interview already exists!");
  }

  //create interview in db
  const interview = await Interview.create({
    company,
    position,
    date,
    place,
  });
  if (!interview) {
    throw new apiError(500, "Unable to schedule interview!");
  }
  //send response
  return res
    .status(201)
    .json(new apiResponse(201, interview, "Interview scheduled successfully!"));
});

const allocateInterview = asyncHandler(async (req, res) => {
  //get interview id from client
  const { interview_id, student_id } = req.query;
  if (!interview_id || !student_id) {
    throw new apiError(400, "Interview id and student id's are required!");
  }
  //fetch student data from db
  const student = await Student.findById(student_id);
  if (!student) {
    throw new apiError(400, "Student not available in db!");
  }
  //fetch interview from db
  const interview = await Interview.findById(interview_id);
  if (!interview) {
    throw new apiError(500, "Error while allocating the interview!");
  }
  //check if student is already in the allocated list
  const index = interview.studentList.findIndex(
    (data) => data._id === student._id
  );
  if (index !== -1) {
    throw new apiError(400, "Interview already allocated to student!");
  }
  //push interview data in student schema
  student.interviewList?.push(interview_id);
  await student.save({ validateBeforeSave: false });
  //push student data in interview
  interview.studentList?.push(student);
  await interview.save({ validateBeforeSave: false });
  //send response
  return res
    .status(200)
    .json(new apiResponse(200, interview, "Interview allocated successfully!"));
});

export { renderInterviews, scheduleInterview, allocateInterview };
