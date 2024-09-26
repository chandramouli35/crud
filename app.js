const express = require("express");
const mongoose = require("mongoose");
const imageRouter = require("./routes/image");
const post = require("./routes/postroute");
const paginationRoute = require("./routes/paginationRoute");
const usersRoute = require("./routes/searchUser");
const adminRoute = require("./routes/adminRoute");
const cronJobs = require("./cronJobs/scheduledTasks");
const mockPaymentRoutes = require("./routes/mockPaymentRoutes");

const path = require("path");
const url =
  "mongodb+srv://Codecrafty1:Codecrafty1@cluster0.83n1dpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connnect = mongoose.connection;

connnect.on("open", () => {
  console.log("MongoDb Connected...");
});
connnect.on("error", (err) => {
  console.error("MongoDB Connection Error:", err.message);
  process.exit(1); // Exit the process with an error code
});

app.use(express.json());

const alienRouter = require("./routes/aliens");
const authRouter = require("./routes/auth");
// Import your auth routes
app.use("/aliens", alienRouter);
app.use("/", authRouter);
app.use("/api", imageRouter);
app.use("/api/posts", post);
app.use("/api/pages", paginationRoute);
app.use("/api/users", usersRoute);
app.use("/api/admin", adminRoute);
app.use("/api/payment", mockPaymentRoutes);
app.listen(1000, () => {
  console.log("Server Started....");
});
