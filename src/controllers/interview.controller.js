import { resultList } from "../constants.js";
import { Company } from "../models/company.model.js";
import { Interview } from "../models/interview.model.js";
import { Student } from "../models/student.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//create controller to render interviews list page
const renderInterviews = asyncHandler(async (req, res) => {
   //get interviewList from db
   const interviewList = await Interview.find();
   if (!interviewList) {
      throw new apiError(404, "Interview data not found!");
   }
   return res.status(200).render("interview", { interviewList, resultList });
   // .json(
   //    new apiResponse(
   //       200,
   //       interviewList,
   //       "Interview list fetched successfully!"
   //    )
   // );
});

//create controller to render schedule interview page
const renderScheduleInterviewPage = asyncHandler(async (req, res) => {
   const companiesList = await Company.find();
   const studentsList = await Student.find();
   return res
      .status(200)
      .render("schedule_interview", { companiesList, studentsList });
});

//create controller to schedule an interview
const scheduleInterview = asyncHandler(async (req, res) => {
   //fetch all the data from the client
   const { company, student, position, date, place } = req.body;
   //check data validation
   if (!company.trim() || !position.trim() || !date || !place.trim()) {
      throw new apiError(400, "All fields required!");
   }
   //get company and student data from db
   const existingCompany = await Company.findById(company);
   if (!existingCompany) {
      throw new apiError(400, "Company data does not exist!");
   }
   const existingStudent = await Student.findById(student).select(
      "-password -refreshToken"
   );
   if (!existingStudent) {
      throw new apiError(400, "Student data does not exist!");
   }
   //check if interview already exixts
   const existingInterview = await Interview.findOne({
      $and: [{ company }, { student }, { position }, { date }, { place }],
   });
   if (existingInterview) {
      throw new apiError(400, "Interview already exists!");
   }

   //create interview in db
   const interview = await Interview.create({
      company,
      companyName: existingCompany.name,
      student,
      studentName: existingStudent.fullName,
      position,
      date,
      place,
   });
   if (!interview) {
      throw new apiError(500, "Unable to schedule interview!");
   }
   //update interview list into student data
   existingStudent.interviewList.push(interview._id);
   await existingStudent.save();
   //send response
   return res.status(201).redirect("back");
   // .json(
   //    new apiResponse(201, interview, "Interview scheduled successfully!")
   // );
});

//create controller function to update interview status in db
const updateInterviewResult = asyncHandler(async (req, res) => {
   //get interview id and data from client
   //check for data validation
   //update interview data and send response to user
   const { result } = req.body;
   const { _id } = req.params;

   if (result?.trim() === "") {
      throw new apiError(400, "Result data is required!");
   }

   const interview = await Interview.findByIdAndUpdate(
      _id,
      {
         result,
      },
      {
         new: true,
      }
   );
   if (!interview) {
      throw new apiError(400, "Interview data is not present in database!");
   }

   return res.status(200).redirect("back");
});

//create controller to delete interview from db
const removeInterview = asyncHandler(async (req, res) => {
   //get data from client end
   //remove interview from db
   //update student data wich has interview in interviewlist
   const { _id } = req.params;
   const interview = await Interview.findByIdAndDelete(_id);

   if (!interview) {
      throw new apiError(400, "Interview does not exist!");
   }
   const student = await Student.findById(interview.student);
   if (!student) {
      throw new apiError(400, "Student data does not exist in DB!");
   }
   const newList = student.interviewList.filter(
      (data) => data === interview._id
   );

   student.interviewList = [...newList];
   await student.save();

   return res.status(200).redirect("back");
});

export {
   renderInterviews,
   scheduleInterview,
   updateInterviewResult,
   renderScheduleInterviewPage,
   removeInterview,
};

//create controller to allocate any intrview to student
// const allocateInterview = asyncHandler(async (req, res) => {
//    //get interview id from client
//    const { interview_id, student_id } = req.query;
//    if (!interview_id || !student_id) {
//       throw new apiError(400, "Interview id and student id's are required!");
//    }
//    //fetch student data from db
//    const student = await Student.findById(student_id);
//    if (!student) {
//       throw new apiError(400, "Student not available in db!");
//    }
//    //fetch interview from db
//    const interview = await Interview.findById(interview_id);
//    if (!interview) {
//       throw new apiError(500, "Error while allocating the interview!");
//    }
//    //check if student is already in the allocated list
//    const index = interview.studentList.findIndex(
//       (data) => data._id === student._id
//    );
//    if (index !== -1) {
//       throw new apiError(400, "Interview already allocated to student!");
//    }
//    //push interview data in student schema
//    student.interviewList?.push(interview_id);
//    await student.save({ validateBeforeSave: false });
//    //push student data in interview
//    interview.studentList?.push(student);
//    await interview.save({ validateBeforeSave: false });
//    //send response
//    return res
//       .status(200)
//       .json(
//          new apiResponse(200, interview, "Interview allocated successfully!")
//       );
// });
