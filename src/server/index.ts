import express from 'express';
import rootRoutes from "./routes/root";
import httpErrors from "http-errors";
import {timeMiddleware} from "./middleware/time";

//index.tx: setting up application, define application in other parts

const app = express();

const PORT = process.env.PORT || 3000;

//TO RUN: npx ts-node src/server/index.ts
//replaced with script in package.json, automatically knows to call npx
//replaced with nodemon --exec ts-node src/server/index.ts so we don't have to kill and restart the server every time we make an update to the site
    //still must restart server IF new dependency is imported, add NODE_ENV=production to beginning to get non-dev version of errors



// const fn = (request, response) => {

// }

// const fn2 = (request, response) => {
    
// }

//any time a get request is made to the root of our site, this will be executed
// app.get("/", (request, response) => {
//     response.send("Hello World!");
// });


//middleware functions, tells express to execute "next" thing in function chain after this one----------------------------------------------------

app.use(timeMiddleware);

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