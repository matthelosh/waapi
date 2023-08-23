const express = require('express');
const web = require("../controllers/WebController")
const wa = require("../controllers/WaController")
const router = express.Router();


router.get("/", web.home);
router.get("/status", wa.info);

module.exports = router
