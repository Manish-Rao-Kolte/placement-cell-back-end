import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT;

app.listen(port, (err) => {
  if (err) {
    console.log("error", err);
    return;
  }
  console.log(`server is running on port: ${port}`);
});
