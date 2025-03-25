require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const fileUpload = require("express-fileupload");

const { connectDB } = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const AppError = require("./utils/appError");
require("./config/passport");

const PORT = process.env.APP_PORT || 5000;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use("/uploads", express.static("uploads"));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    safeFileNames: true,
    limitHandler: (req, res, next) => {
      throw new AppError("File size exceeds the limit", 413);
    },
  }),
);

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.use("*", (req, res, next) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
});

app.use(globalErrorHandler);

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
