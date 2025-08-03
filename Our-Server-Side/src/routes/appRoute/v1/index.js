const router = require("express").Router();
const {heartBeat} = require("../../../controller/app/heartbeat.js");

router.use("/heartbeat", heartBeat);

module.exports = router;