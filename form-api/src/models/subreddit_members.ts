
import client from '../database.js'

export type subreddit_member = {
    id?: number,
    subreddit_id: number,
    member_id: number,
}

export class subredditMembersStore {
    async index() {

    }

    async addMember(subreddit_member: subreddit_member): Promise<boolean> {

        console.log("about to add member: " + JSON.stringify(subreddit_member))
        const conn = await client.connect();
        let sql = 'INSERT INTO subreddit_members (subreddit_id, member_id) VALUES ($1, $2) RETURNING *';
        const results = await conn.query(sql, [subreddit_member.subreddit_id, subreddit_member.member_id]).catch(err=>{console.error(err)})
        if(results){
            sql = 'UPDATE subreddits SET members = members + 1 WHERE id=($1)' 
            await conn.query(sql, [subreddit_member.subreddit_id])
            conn.release();
            return true
        }
        conn.release();
        return false
    }

    async getSubredditMember(subreddit_member: subreddit_member): Promise<subreddit_member> {

        const conn = await client.connect();
        const sql = 'SELECT * FROM subreddit_members WHERE subreddit_id=($1) AND member_id=($2)';
        const results = await conn.query(sql, [subreddit_member.subreddit_id, subreddit_member.member_id]);
        conn.release();
        //@ts-ignore
        return results.rows[0];
    }

    async getSubredditsMember(subreddit_member: subreddit_member): Promise<subreddit_member> {

        const conn = await client.connect();
        const sql = 'SELECT * FROM subreddit_members WHERE member_id=($1)';
        const results = await conn.query(sql, [subreddit_member.member_id]);
        conn.release();
        //@ts-ignore
        return results.rows[0];


    }

    async leaveSubreddit(subreddit_member: subreddit_member): Promise<subreddit_member> {
        const conn = await client.connect();
        const sql = 'DELETE FROM subreddit_members WHERE subreddit_id=($1) AND member_id=($2)';
        const results = await conn.query(sql, [Number(subreddit_member.subreddit_id), Number(subreddit_member.member_id)]);
        conn.release();
        //@ts-ignore
        return results;


    }
}
