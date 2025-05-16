import pgpLib from "pg-promise";
import dotenv from "dotenv";
dotenv.config(); // Load .env before using process.env

const pgp = pgpLib();
const db = pgp(process.env.DATABASE_URL!);

export default db;
