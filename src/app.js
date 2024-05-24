import express from "express";
import cookieParser from "cookie-parser";

const app = express();

// app.set("view engine", "ejs");
// app.set("");

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

// app.get("/", (req, res) => {
//   res.send("Heyy I am working");
// });

export { app };
