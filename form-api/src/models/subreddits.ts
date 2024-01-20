
import client from '../database.js'


export type subreddit = {

    id?: Number;
    title: string;
    owner_id: Number;
    type: "public" | "private" | "restricted";
    members?: Number;
    creation_date: string;

}

export class subredditsStore {
    async index(): Promise<subreddit[]> {

        const conn = await client.connect();
        const sql = 'SELECT * FROM subreddits';
        const results = await conn.query(sql);
        conn.release();
        //@ts-ignore
        return results.rows;

    }

    async create(subreddit: subreddit): Promise<subreddit> {

        console.log("about to query sub: " + JSON.stringify(subreddit))
        const conn = await client.connect();
        const sql = 'INSERT INTO subreddits (title, owner_id, subtype, members, creation_date) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const results = await conn.query(sql, [subreddit.title, subreddit.owner_id, subreddit.type, 1, subreddit.creation_date]);
        conn.release();
        //@ts-ignore
        return results.rows[0];


    }

    async read(id: number): Promise<subreddit> {

        const conn = await client.connect();
        const sql = 'SELECT * FROM subreddits WHERE id=($1)';
        const results = await conn.query(sql, [id]);
        conn.release();
        return results.rows[0];

    }

    async delete(id: number): Promise<subreddit> {
        const conn = await client.connect();
        const sql = 'DELETE FROM post WHERE id=($1) RETURNING *';
        const results = await conn.query(sql, [Number(id)]);
        conn.release();
        //@ts-ignore
        return results;
    }
}
