const express = require('express');
const wa = require("../controllers/WaController");
const router = express.Router();
const connection = require("../config/db");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const isAuth = async(req, res, next) => {
    if (req.header('secret') && req.header('key')) {
      const auth = await prisma.token.findFirst({
        where: {
          secret: req.header('secret'), key: req.header('key')
        }
      });
      // res.send(auth);
      // console.log(auth);
      if(auth == null) {
        console.log('Credentials not found')
        res.send("Credentials invalid")
        return false
      }
      next()
    } else {
        res.send('Sertakan Rahasia dan Kuncinya');
    }
};
//


router.post("/wa/send", isAuth, wa.send);

router.post("/wa/groups", isAuth, wa.groupIndex)


module.exports = router;
