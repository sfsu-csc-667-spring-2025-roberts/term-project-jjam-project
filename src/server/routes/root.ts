import express from "express";

import {Request, Response} from "express";

const router = express.Router();


// router.get("/", (_request: Request, response: Response) =>{
//     response.send("Hello World from inside a route!");
// });

router.get("/", (_request: Request, response: Response) =>{
    response.send("Hello World from inside named root!");
});


export default router;


// //export anyNameIWant  from "root";
// export {
//     router as rootRouter
// }

// //import { rootRouter } from "root";