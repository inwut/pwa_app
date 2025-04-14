require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const webpush = require("web-push");

const { connectDB } = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const pushSubscriptionRoutes = require("./routes/pushSubscriptionRoutes");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const AppError = require("./utils/appError");
require("./config/passport");

const PORT = process.env.APP_PORT || 5000;
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

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
      res.status(413).json({ error: "File size exceeds the limit" });
    },
  }),
);

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/pushSubscriptions", pushSubscriptionRoutes);

app.use("*", (req, res, next) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
});

app.use(globalErrorHandler);

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
