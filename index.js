const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const ApiRoutes = require("./routes/api");
const HomeRoutes = require("./routes/web");
const wa = require("./controllers/WaController");
// const db = require('./config/db');

// app.use(db);

app.set('view engine', 'pug');
app.use(express.static('assets'))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}))



app.use("/api", ApiRoutes);

app.get('/', HomeRoutes);
app.get("/status", wa.info);

app.listen(port, () => {
      console.log(`Waapi running on port ${port}`);
    });
