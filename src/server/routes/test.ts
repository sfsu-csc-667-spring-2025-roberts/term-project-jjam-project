import express from "express";
import { Request, Response } from "express";
import db from "../db/connection";

const router = express.Router();
//dumping ground for new code to get things and test if it works

// new Promise((resolve, reject) => {
//     return db.any("SELECT * FROM test_table");
// }).then((result)=>{
//     console.log(result);
// }).catch(error => {
//     console.error(error);
// });

router.get("/", async (_request: Request, response: Response) => {
    //ensure we have a working database connection
    try{
        await db.none("INSERT INTO test_table (test_string) VALUES ($1)", [`test string $(new Date().toISOString()}`]);//enter record into test table
        //we COULD make the sql string on our own, but this makes us vulnerable to sql injection attack
        //such as if a user named themselves a postgres command, that command would execute (little bobby droptables xdcd joke)
        //pg promise "sanatizes" our input strings

        //const result = await db.any("SELECT * FROM test_table");//await makes it so the code waits for the promise to resolve
        //response.render("template_name, { data: "hi"});//another way we can respond to the client without json
        //response.json(result);//send response to client using json

        response.json(await db.any("SELECT * FROM test_table"));//fetch all records from test table and returning them to the client as json
    }catch (error){
        console.error(error);
        response.status(500).json({error: "internal Server Error"});
    }
});

//both new Promise and router.get functions here are functionally equivalent, just interact with promise with different syntax
//REMEMBER: when working with asynchronous code, we are not returned data but instead a promise object we must work with


//implementation of db.none
// const none = (sql: string, values: any[]) => {
//     return new Promise((resolve, reject) => {
//         //Do actiona database operations here
//         const (result, error) = { "whatever the database logic is", error:null };
//          if(error !== null){
//              reject(error);
//          }
//         resolve(result);
//     });
// }

router.get("/promise_version", (request: Request, response: Response) => {
    db.none(
        "INSERT INTO test_table (test_string) VALUES ($1)", [
            `test string $(new Date().toISOString()}`
        ]).then(() => {
            return db.any("SELECT * FROM test_table");
        }).then((result) => {
            response.json(result);
        }).catch((error) => {
            console.error(error);
            response.status(500).json({error: "internal Server Error"});
        });
});

//we are NEVER using sockets for state management because the server is the only truth we need
router.post("/socket-test", (request: Request, response: Response) =>{
    const io = request.app.get("io");
    //@ts-ignore
    const { id } = request.session.user;
    if(io){
        console.log("io not null");
        io.emit("test-event", {message: "Hello from the server!", timestamp: new Date()});
        io.to(id).emit("test-event", {
            message: `Secret message for user ${id}`,
            timestamp: new Date(),
        });
        response.status(200).send();
    }else{
        response.status(500).send();
    }
});

export default router;
