const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const ApiRoutes = require("./routes/api");
const HomeRoutes = require("./routes/web");
// const db = require('./config/db');

// app.use(db);

app.set('view engine', 'pug');
app.use(express.static('assets'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use("/api", ApiRoutes);

app.get('/', HomeRoutes);

app.listen(port, () => {
      console.log(`Waapi running on port ${port}`);
    });
