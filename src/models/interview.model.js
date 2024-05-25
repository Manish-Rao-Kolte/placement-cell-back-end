import mongoose, { Schema } from "mongoose";

const interviewSchema = new Schema({
  interview: {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    result: {
      type: String,
      enum: ["PASS", "FAIL", "On Hold", "Did not Attempt"],
    },
  },
});

export const Interview = mongoose.model("Interview", interviewSchema);
