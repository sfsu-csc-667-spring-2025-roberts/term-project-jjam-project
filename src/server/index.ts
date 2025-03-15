import * as path from "path";
import express from 'express';
import rootRoutes from "./routes/root";
import httpErrors from "http-errors";
import morgan from "morgan";//function that returns middleware
import cookieParser from "cookie-parser";
import {timeMiddleware} from "./middleware/time";

//index.tx: setting up application, define application in other parts

const app = express();

const PORT = process.env.PORT || 3000;

//TO RUN: npx ts-node src/server/index.ts
//replaced with script in package.json, automatically knows to call npx
//replaced with nodemon --exec ts-node src/server/index.ts so we don't have to kill and restart the server every time we make an update to the site
    //still must restart server IF new dependency is imported, add NODE_ENV=production to beginning to get non-dev version of errors


//husky: library that allows us to define "kit hooks"
    //there are life cycle events that happen when working with the git repository
    //hook is code that executes in response to one of those events
    //for instance, if we wanted to make code that executes when we commit to the git repository

//npx lint-staged: run lint-staged script in the context of the node modules package

//any time a get request is made to the root of our site, this will be executed
// app.get("/", (request, response) => {
//     response.send("Hello World!");
// });


//middleware functions, tells express to execute "next" thing in function chain after this one----------------------------------------------------

//function that returns middleware
app.use(morgan("dev"));

//any time the express server recieves a request with content type application json, automatically takes body of request and turns it into an object in the request parameter
app.use(express.json());

//allows to take special characters in urls
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

app.use(timeMiddleware);



//express can also serve static files, unchanging ungenerated files

//app.use(express.static(process.cwd() + "/public")); //the /public would mean this would only work on a nix system, we need to make it generic to run on windows
//if the request matches a file in "public", the file will be served rather than executing code
    //example: image file called favicon.ico will be used in browser as tab icon
app.use(express.static(path.join(process.cwd(), "public")));

//html template using ejs, makes responses that respond with html easier to make
app.set("views", path.join(process.cwd(), "src", "server", "templates"));
app.set("view engine", "ejs");


//use called with mount point, meaning any routes from rootRoutes are relative to the base url (represented by "/")
app.use("/", rootRoutes);
app.use("/test", () => {});



//displays 404 error for urls that don't exist on site
//put towards bottom because style is executed from top to bottom, we want this to execute once all other routes have been defined
//variables that start with underscore are probably not going to be used, common practice
app.use((_request, _response,next) => {
    next(httpErrors(404));
});

//video 37:13
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);//use backticks instead of ' or " (same key as ~, above tab)
});