import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Heyy I am working");
});

app.listen(port, (err) => {
  if (err) {
    console.log("error", err);
    return;
  }
  console.log(`server is running on port: ${port}`);
});
