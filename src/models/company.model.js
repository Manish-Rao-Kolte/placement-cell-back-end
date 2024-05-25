import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  companyCode: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: Number,
  },
});

export const Company = mongoose.model("Company", companySchema);
