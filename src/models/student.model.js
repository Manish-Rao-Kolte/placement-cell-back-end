import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  batch: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  college: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["placed", "not_placed"],
    default: "not_placed",
  },
  courseScores: {
    DSA: {
      type: Number,
      required: true,
    },
    WebD: {
      type: Number,
      required: true,
    },
    React: {
      type: Number,
      required: true,
    },
  },
  interviewList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Interview",
    },
  ],
});

export const Student = mongoose.model("Student", studentSchema);
