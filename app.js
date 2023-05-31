const express = require("express");
const app = express();
const port = 3000;

// use public folder
app.use(express.static("public"));

const path = require("path");
const ejs = require("ejs");
const db = require("./services/database");
const ws = require("./services/websockets");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const cors = require("cors");
app.use(cors());

const fileUpload = require("express-fileupload");
app.use(fileUpload({
    createParentPath: true
}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const fs = require("fs");
const morgan = require("morgan");
// create a write stream (in append mode) (every time a request comes in, we want to write a new line)
const accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/requests.log'), { flags: 'a' });
// write detailed logs into the specified file (write the request in combined format = much information into the accessLogStream)
app.use(morgan('combined', { stream: accessLogStream }));
// write short logs into the console (log the short version into the console)
app.use(morgan('short'));

// Calling the routers
const indexRouter = require("./routes/index.js");
const usersRouter = require("./routes/users.js");

app.use("/", indexRouter);
app.use("/users", usersRouter);

function errorHandler(err, req, res, next) {
    res.render("error", {error: err});
}
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});