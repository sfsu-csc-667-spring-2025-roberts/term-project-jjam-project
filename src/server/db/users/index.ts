//database stuff will be here
import bcrypt from "bcrypt";
import crypto from "crypto";

import db from "../connection";

//what we need to do:

//register user
//create new record in the user table with email and encrypted password
//redirect the user to the lobby page
//return exception if a non unique email is attempted to be inserted into db
const register = async (email: string, password: string) => {
    const sql = "INSERT INTO users (email, password, gravatar) VALUES($1, $2, $3) RETURNING id, gravatar";

    const hashedPassword = await bcrypt.hash(password, 10);
    const {id, gravatar} = await db.one(sql, [email, hashedPassword, crypto.createHash("sha256").update(email).digest("hex")]);
    return {id, gravatar, email};
}

//log in user
//check if the email and pasword exists in the user table

//to test in psql:
//insert into users (email, password) values ('testemail@test.com', 'password');
const login = async (email: string, password: string) => {
    const sql = "SELECT * FROM users WHERE email = $1";
    const {id, gravatar, password: encryptedPassword} = await db.one(sql, [email]);//automatically throws errors for us
    // if (!user){
    //     throw new Error("User not found");
    // }
    const isValidPassword = await bcrypt.compare(password, encryptedPassword);
    if (!isValidPassword){
        throw new Error("Invalid credentials, try again");
    }

    return {id, gravatar, email};
}

export default{ 
    register, login
};

