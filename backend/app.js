require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const cors = require("cors");
const passport = require("passport");

const { connectDB } = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const AppError = require("./utils/appError");

require("./config/passport");

const PORT = process.env.APP_PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

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
