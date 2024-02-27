
import client from '../database.js'


export type mailCode = {
    id?: Number;
    user_id: Number;
    code: Number;
}

export class mailCodeStore {
    async createMailCode(mailCode: mailCode): Promise<mailCode | undefined> {
        try {
            const conn = await client.connect();
            const sql = 'INSERT INTO mail_codes (user_id, code) VALUES ($1, $2) ON CONFLICT (user_id, code) DO UPDATE SET code=($2) RETURNING (SELECT code FROM mail_codes WHERE user_id=($1) AND user_id=($2))';
            //without json.stringify, JSON is stored with \" instead of "
            const results = await conn.query(sql, [mailCode.user_id, mailCode.code]);
            conn.release();
            if (results.rows[0]) {
                console.log("after mailCode insert: " + results.rows[0].code)
                return results.rows[0];
            }
            else return 

        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    async getMailCode(user_id: number): Promise<string | undefined> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT code FROM mail_codes WHERE user_id=($1)';
            const results = await conn.query(sql, [user_id]);
            conn.release();
            if (results.rows[0] && results.rows[0].code) {
                
                return results.rows[0].code
            } else {
                return
            }

        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

}
