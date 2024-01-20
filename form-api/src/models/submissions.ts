
import client from '../database.js'


export type submission = {
    id?: Number;
    form_id: string;
    form: string;
}

export class submissionsStore {
    async create(submission: submission): Promise<submission> {
        try {

            const conn = await client.connect();
            const sql = 'INSERT INTO submissions (form_id, submission) VALUES ($1, $2) RETURNING *';
            //without json.stringify, JSON is stored with \" instead of "
            const results = await conn.query(sql, [submission.form_id, JSON.stringify(submission.form)]);
            conn.release();

            if (results.rows[0]) {

                //console.log("after submission insert: "+JSON.parse(results.rows[0].submission)[0].id)
                console.log("after submission insert: " + results.rows[0].submission)

                //console.log(JSON.parse(results.rows[0].submission[0]))
            }
            return results.rows[0];
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    async getSubmission(id: number): Promise<submission> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM submissions WHERE id=($1)';
            const results = await conn.query(sql, [id]);
            console.log("getsubmission: " + results.rows[0].submission)
            conn.release();
            return results.rows[0];

        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }


    async getFormSubmissions(id: number): Promise<Array<any>> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT submission FROM submissions WHERE form_id=($1)';
            const results = await conn.query(sql, [id]);
            if (results.rows[0] && results.rows[0].submission) {
                conn.release();
                //submission field has a JSON string, but the returned row objects arent JSON, so I can't JSON.parse(rows)  
                const parsedSubmissions = results.rows.map((row) => { return { submission: JSON.parse(row.submission) } })
                return parsedSubmissions
            } else {
                return []
            }

        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

}
