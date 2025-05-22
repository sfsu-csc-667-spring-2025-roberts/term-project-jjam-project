"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const http = __importStar(require("http"));
const express_1 = __importDefault(require("express"));
//import rootRoutes from "./routes/root";
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan")); //function that returns middleware
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const time_1 = require("./middleware/time");
//ALWAYS import dotenv BEFORE importing connection object
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); //reads values in .env file
const config = __importStar(require("./config"));
const routes = __importStar(require("./routes")); //takes the job of import testRouter and import rootRoutes
const middleware = __importStar(require("./middleware"));
const socket_io_1 = require("socket.io");
//import testRouter from "./routes/test";//connection object
//index.tx: setting up application, define application in other parts
const app = (0, express_1.default)();
const server = http.createServer(app);
const io = new socket_io_1.Server(server); //sets up io server along side our express application
const PORT = process.env.PORT || 3000;
config.liveReload(app);
//config.session(app);
const sessionMiddleware = config.session(app);
config.Socket(io, app, sessionMiddleware);
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
app.use((0, morgan_1.default)("dev"));
//any time the express server recieves a request with content type application json, automatically takes body of request and turns it into an object in the request parameter
app.use(express_1.default.json());
//allows to take special characters in urls
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(time_1.timeMiddleware);
// app.use(
//   express.urlencoded{{
//     extended: false,
//   }
// });
//express can also serve static files, unchanging ungenerated files
//app.use(express.static(process.cwd() + "/public")); //the /public would mean this would only work on a nix system, we need to make it generic to run on windows
//if the request matches a file in "public", the file will be served rather than executing code
//example: image file called favicon.ico will be used in browser as tab icon
app.use(express_1.default.static(path.join(process.cwd(), "public")));
app.use(middleware.roomMiddleware);
//html template using ejs, makes responses that respond with html easier to make
app.set("views", path.join(process.cwd(), "src", "server", "templates"));
app.set("view engine", "ejs");
//use called with mount point, meaning any routes from rootRoutes are relative to the base url (represented by "/")
app.use("/", routes.root);
//app.use("/test", () => {});
app.use("/test", routes.test);
app.use("/auth", routes.auth);
app.use("/lobby", middleware.authMiddleware, routes.lobby); //executes authentication middleware before doing anything else to verify user
app.use("/chat", middleware.authMiddleware, routes.chat);
app.use("/api/games", routes.apiGames);
//displays 404 error for urls that don't exist on site
//put towards bottom because style is executed from top to bottom, we want this to execute once all other routes have been defined
//variables that start with underscore are probably not going to be used, common practice
app.use((_request, _response, next) => {
    next((0, http_errors_1.default)(404));
});
//video 7 37:13
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); //use backticks instead of ' or " (same key as ~, above tab)
});
//postgres stuff:
//to create postgres database: createdb -U postgres spring-2025 (password=1234)
//to see database: psql -U postgres spring-2025
//each person will have their own copy of the database, so people can tinker without messing each other up
//npm install node-pg-migrate
//migrations: library that helps us incrementally change the structure of our database that we can record in our code
//"db:create": "node-pg-migrate create -j ts --", //create file
//"db:migrate": "ts-node node_modules/node-pg-migrate/bin/node-pg-migrate.js up -j ts", //apply changes to database
//"db:rollback": "ts-node node_modules/node-pg-migrate/bin/node-pg-migrate.js down -j ts", //reverts changes to database
//video 8 1:19:35
//npm run db:create test migration //DO NOT CHANGE TITLE OF MIGRATION FILE, is timestamp that is needed to run migrations in correct order
//video 8 1:24:50
//npm run db:migrate //executes migration from migration file, translates code to sql
//to see test table:
//psql -U postgres spring-2025
//\dt //the pgmigrations table isn't our creation, it's how the migrations are kept track of
//select * from test_table; 
//\d test_table
//to undo creation of test_table
//npm run db:rollback
//2:00:51
//1:06:21 class 9
//drop db: dropdb -U postgres spring-2025
