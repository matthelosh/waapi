const express = require('express');
const web = require("../controllers/WebController")
const router = express.Router();


router.get("/", web.home);

module.exports = router