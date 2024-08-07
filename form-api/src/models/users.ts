import client from '../database.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const { pepper, saltRounds} = process.env;

export type user = {
    id?: number,
    username: string,
    password: string,
    email: string,

}

export type errorMsg = {
    param: string;
    msg: string;
}

export class usersStore {
    async index(): Promise<user[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users';
            const results = await conn.query(sql);
            conn.release();
            
            return results.rows;
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    //See if email or username already exist
    async validateSignUp(user: user): Promise<Array<errorMsg>> {
        try {
            
            const startTime = console.time('queryExecution');
            console.log("validation query")
            const conn = await client.connect();
            let sql = 'SELECT * FROM users WHERE username=($1) OR email=($2)'
            const userError = await conn.query(sql, [user.username, user.email])
            console.timeEnd('queryExecution'); 
            let errors: Array<errorMsg>=[];
            
            if (userError.rows[0]) {
                for (const foundUser of userError.rows) {
                    if (foundUser.username == user.username){ errors.push({param: "username", msg:"Username already exists"});}
                    if (foundUser.email == user.email){ errors.push({param: "email", msg:"Email already in-use"});};
                }
            }
            return errors;
        }
        catch(err){throw new Error(`${err}`)}
    }

    
    async signup(user: user): Promise<user> {
        try {

            const passhash = bcrypt.hashSync(
                `${user.password}` + pepper,
                Number(saltRounds)
            );

            const conn = await client.connect();
            const sql = 'INSERT INTO users ("username", "password", "email") VALUES ($1, $2, $3) RETURNING *';
            const results = await conn.query(sql, [user.username, passhash, user.email]);
            conn.release();

            return results.rows[0];
        }

        catch (err) {throw new Error(`${err}`)}
    }

    async signin(user: user): Promise<user[]> {

        try {

            
            const startTime = console.time('queryExecution');
            console.log("signin query")
            console.log("sql username: " + user.username + " sql password: " + user.password)

            const conn = await client.connect();
            const sql = 'SELECT * FROM users WHERE username=($1)';
            const results = await conn.query(sql, [user.username]);
            conn.release();
            console.timeEnd('queryExecution'); 
            if(results.rows[1]){
                "DB error: 2 results to sign in query"
            }
            
            if(results.rows[0]){
                if(bcrypt.compareSync(user.password+pepper, results.rows[0].password)){
                    
                    return results.rows;
                }
            }

            //invalid username or pass. return empty array.
            results.rows.pop(); 
            return results.rows;
            

        }

        catch (err) {
            throw new Error(`${err}`)
        }
    }
}