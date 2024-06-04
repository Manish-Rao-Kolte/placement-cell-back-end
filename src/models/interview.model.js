import mongoose, { Schema } from "mongoose";
import { resultList } from "../constants.js";

const interviewSchema = new Schema({
   company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
   },
   companyName: {
      type: String,
      required: true,
   },
   student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
   },
   studentName: {
      type: String,
      required: true,
   },
   position: {
      type: String,
      required: true,
   },
   date: {
      type: Date,
      required: true,
   },
   place: {
      type: String,
      required: true,
   },
   result: {
      type: String,
      enum: resultList,
      default: "Scheduled",
   },
});

export const Interview = mongoose.model("Interview", interviewSchema);
