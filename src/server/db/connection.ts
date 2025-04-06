import pgp from "pg-promise";//called pg promise because it returns async promise, how we execute asychronous code
//returns resolve if promise is successful in doing its work, returns reject if not

//const connection = pgp()(process.env.DATABASE_URL!);
//postgres://postgres:1234@localhost:5432/spring-2025

const connection = pgp()(process.env.DATABASE_URL!);
export default connection; //object that reprsents data, how we communicate with our database

