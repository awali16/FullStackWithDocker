const router = require("express").Router();
const appRoute = require("./appRoute");

router.use("/api", appRoute);

module.exports = router;