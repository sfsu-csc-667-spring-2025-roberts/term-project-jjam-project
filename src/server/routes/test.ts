import express from "express";
import { Request, Response } from "express";
import db from "../db/connection";

const router = express.Router();

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
    }
});

//both new Promise and router.get functions here are functionally equivalent, just interact with promise with different syntax
//REMEMBER: when working with asynchronous code, we are not returned data but instead a promise object we must work with

export default router;
