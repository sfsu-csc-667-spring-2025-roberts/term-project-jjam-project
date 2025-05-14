"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// router.get("/", (_request: Request, response: Response) =>{
//     response.send("Hello World from inside a route!");
// });
router.get("/", (_request, response) => {
    const title = "JJam's site"; //name that appears on site's tab
    const name = "testname";
    //response.send("Hello World from inside named root!");
    //we can also respond with html! However, this is inefficient, so we need templating to make it easier
    //examples of templaters: ejs, handlebars, pug
    // response.send(
    //     `<html><head><title>${title}</title></head><body><h1>${title}</h1><p>This is some content!</p></html>`
    // );
    response.render("root", { title, name }); //{title} is the same as const thing = {title: title};
});
exports.default = router;
// //export anyNameIWant  from "root";
// export {
//     router as rootRouter
// }
// //import { rootRouter } from "root";
