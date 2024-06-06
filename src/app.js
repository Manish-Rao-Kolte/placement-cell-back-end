import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(cors());
app.use(
   express.urlencoded({
      extended: true,
      limit: "16kb",
   })
);
app.use(
   express.json({
      limit: "16kb",
   })
);
app.use(express.static("public"));
app.use(cookieParser());

// routes import

import userRouter from "./routes/api/v1/user.route.js";
import studentRouter from "./routes/api/v1/student.route.js";
import interviewRouter from "./routes/api/v1/interview.route.js";
import companyRouter from "./routes/api/v1/company.route.js";
import homeRouter from "./routes/api/v1/home.route.js";

// routes declarations
app.use("/api/v1/", homeRouter);
app.use("/api/v1/users/", userRouter);
app.use("/api/v1/students/", studentRouter);
app.use("/api/v1/interviews/", interviewRouter);
app.use("/api/v1/companies/", companyRouter);
app.use("*", (req, res) => {
   const url = req.baseUrl;
   return res.status(404).render("404_page", { url });
});

// app.get("/", (req, res) => {
//   res.send("Heyy I am working");
// });

export { app };
