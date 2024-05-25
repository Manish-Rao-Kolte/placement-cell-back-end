import mongoose, { Schema } from "mongoose";

const interviewSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
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
  studentList: [
    {
      student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        // required: true,
      },
      result: {
        type: String,
        enum: ["PASS", "FAIL", "On Hold", "Did not Attempt", "Scheduled"],
        default: "Scheduled",
      },
    },
  ],
});

export const Interview = mongoose.model("Interview", interviewSchema);
