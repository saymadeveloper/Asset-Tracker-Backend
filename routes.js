
const routes = require("./routes/index");
const router = require("express").Router();

module.exports = (app) => {
  app.use("/user", router.use(routes.user));
  app.use("/asset", router.use(routes.asset));
  app.get("/welcome", (req, res) => {
    return res.json({
      code: 200,
      message: "Congratulations! Your Asset Tracker App backend is ready!",
    });
  });
};