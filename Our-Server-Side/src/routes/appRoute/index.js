const router = require("express").Router();

const V1 = require("./v1");
const V2 = require("./v2");

router.use("/v1", V1);
router.use("/v2", V2);

module.exports = router;