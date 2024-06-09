import { Parser } from "@json2csv/plainjs/index.js";
import { Student } from "../models/student.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { LocalStorage } from "node-localstorage";

//controller function to render home page
const renderHome = asyncHandler(async (req, res) => {
      //intialize local storage to save api calls to job portal as we are getting limited free calls. This implementation can be removed in production.
      let localStorage;
      if (!localStorage) {
            localStorage = new LocalStorage("./scratch");
      }
      const studentList = await Student.find();
      if (!studentList) {
            throw new apiError(500, "No data available or unable to fetch!");
      }
      /*
   create external job links
  */
      const url = process.env.JOB_API_URI;
      const options = {
            method: "GET",
            headers: {
                  "x-rapidapi-key": process.env.JOB_API_KEY,
                  "x-rapidapi-host": "jobs-api14.p.rapidapi.com",
            },
      };

      try {
            let jobList = [];
            // const response = await fetch(url, options);
            // const jobList = await response.json();
            // console.log(jobList);
            if (!localStorage.getItem("jobList")) {
                  await fetch(url, options)
                        .then((res) => res.json())
                        .then((data) => {
                              localStorage.setItem(
                                    "jobList",
                                    JSON.stringify(data.jobs)
                              );
                              jobList = data.jobs;
                        });
            } else {
                  jobList = JSON.parse(localStorage.getItem("jobList"));
            }
            // await fetch(url, options)
            //    .then((res) => res.json())
            //    .then((data) => {
            //       // jobList = data.jobs;
            //       // const item = LocalStorage.;
            //       // console.log(item);
            //       // localStorage.setItem()
            //    });
            return res
                  .status(200)
                  .render("home", { studentList, jobList: jobList || [] });
      } catch (error) {
            throw new apiError(500, error || "Internal server error!");
      }
});

//create controller to generate csv file
const generateCSV = asyncHandler(async (req, res) => {
      //get all the data of student and interview from db
      //generate csv
      //return response
      const studentList = await Student.find()
            .populate(
                  "interviewList",
                  "-company -_id -student -createdAt -updatedAt"
            )
            .select("-createdAt -updatedAt");
      const data = [];
      for await (let student of studentList) {
            let obj = {};
            if (student.interviewList.length > 0) {
                  for await (let interview of student.interviewList) {
                        obj["Student Id"] = student._id;
                        obj["Student Name"] = student.fullName;
                        obj["Student Email"] = student.email;
                        obj["Student Phone"] = student.phone;
                        obj["Student Batch"] = student.batch;
                        obj["Student College"] = student.college;
                        obj["Student Status"] = student.status;
                        obj["DSA Score"] = student.courseScores.DSA;
                        obj["WebD Score"] = student.courseScores.WebD;
                        obj["React Score"] = student.courseScores.React;
                        obj["Interview Date"] = interview.date;
                        obj["Interview Company"] = interview.companyName;
                        obj["Interview Result"] = interview.result;
                        data.push(obj);
                        obj = {};
                  }
            } else {
                  obj["Student Id"] = student._id;
                  obj["Student Name"] = student.fullName;
                  obj["Student Email"] = student.email;
                  obj["Student Phone"] = student.phone;
                  obj["Student Batch"] = student.batch;
                  obj["Student College"] = student.college;
                  obj["Student Status"] = student.status;
                  obj["DSA Score"] = student.courseScores.DSA;
                  obj["WebD Score"] = student.courseScores.WebD;
                  obj["React Score"] = student.courseScores.React;
                  obj["Interview Date"] = "";
                  obj["Interview Company"] = "";
                  obj["Interview Result"] = "";
                  data.push(obj);
            }
      }

      //generate csv from data
      try {
            const parser = new Parser();
            const csv = parser.parse(data);
            fs.writeFile("./src/output/data.csv", csv, (err) => {
                  if (err) {
                        return console.log(err);
                  }
                  return res.status(201).download("./src/output/data.csv");
            });
      } catch (err) {
            throw new apiError(500, err);
      }
});

export { renderHome, generateCSV };
