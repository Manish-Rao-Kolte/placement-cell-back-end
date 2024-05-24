import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  college: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
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
  interviews: [
    {
      company: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      result: {
        type: String,
        enum: ["PASS", "FAIL", "On Hold", "Didn’t Attempt"],
      },
    },
  ],
});

export const Student = mongoose.model("Student", studentSchema);
