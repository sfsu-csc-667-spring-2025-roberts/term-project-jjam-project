import express from "express";
import { Request, Response } from "express";
import { User } from "../db";//take all inputs from register and export them as a default object
//import db from "../db/connection";

const router = express.Router();

router.get("/register", async (_request: Request, response: Response) => {
    response.render("auth/register");
});

router.post("/register", async (request: Request, response: Response) => {
    const {email, password} = request.body;

    try{
        const user = await User.register(email, password);
        //response.json({user});

        //@ts-ignore
        request.session.user = user;
        response.redirect("/lobby");
    }catch(error){
        console.error("Error registering user:", error);
        response.render("auth/register", {error: "Invalid credentials", email});
    }
});

router.get("/login", async (_request: Request, response: Response) => {
    response.render("auth/login");
});

router.post("/login", async (request: Request, response: Response) => {
    const {email, password} = request.body;

    try{
        const user = await User.login(email, password);
        //response.json({user});
        //@ts-ignore
        request.session.user = user;
        response.redirect("/lobby");
    }catch(error){
        console.error("Error logging in user:", error);
        response.render("auth/login", {error: "Invalid credentials", email});
    }
});

router.get("/logout", async (request: Request, response: Response) => {
    //@ts-ignore
    request.session.user = null;
    request.session.destroy(() =>{
        //console.log("Session destroyed");
        //intentional no-op for now
    })
    response.redirect("/auth/login");
})

export default router;
