const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/auth/signup", (req, res) => {
  console.log("Signup route hit");
  res.json({ message: "User registered" });
});

app.listen(5000, () => console.log("Test server running on port 5000"));
