
import client from '../database.js'


export type comment = {
    id?: Number;
    user_id: Number;
    text: string;
    votes: Number;
    parent_id: Number | null;
    post_id: Number;
}

export class commentsStore {


    async postComment(comment: comment): Promise<comment> {
        try {

            const conn = await client.connect();
            const sql = 'INSERT INTO comments (user_id, text, votes, parent_id, post_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';

            const results = await conn.query(sql, [comment.user_id, comment.text, comment.votes, comment.parent_id, comment.post_id]);
            conn.release();
            //@ts-ignore
            return results.rows[0];
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }



    async getComments(post_id: number): Promise<comment[]> {
        const conn = await client.connect();
        console.log("POST ID INSIDE GETCOMMENT:" + post_id)
        //Query returns comment as well as the username of the commentator
        const sql = 'SELECT comments.id, comments.post_id, comments.parent_id, comments.user_id, comments.votes, comments.text, users.username FROM comments JOIN users ON comments.post_id=($1) and users.id=comments.user_id';
        const results = await conn.query(sql, [post_id]);
        conn.release();
        return results.rows;

    }

    async deleteComment(id: number): Promise<any> {
        const conn = await client.connect();
        const sql = 'DELETE FROM comments WHERE id=($1) RETURNING *';
        const results = await conn.query(sql, [Number(id)]);
        conn.release();
        return results;

    }
    voteChange(vote: number, old: number) {
        console.log("inside Votechange: " + vote + " " + old)

        //See what the previous state of the vote was, to determine change in vote count
        switch (old) {
            case 0: return vote;
            case 1: if (vote == 1) return 0; else if (vote == 0) return -1; else return -2;
            case -1: if (vote == 1) return 2; else if (vote == 0) return 1; else return 0;
        }
    }
    async submitVote(comment_id: number, user_id: number, post_id: number, vote: number): Promise<boolean> {

        const conn = await client.connect();
        //If vote instance exists(voted before), update/delete the vote instance instead of inserting new vote instance 
        let sql = 'INSERT INTO comment_upvotes (comment_id, user_id, post_id, vote) VALUES ($1, $2, $3, $4) ON CONFLICT (comment_id, user_id) DO UPDATE SET vote=($4) RETURNING (SELECT vote FROM comment_upvotes WHERE comment_id=($1) AND user_id=($2)) ';
        const results = await conn.query(sql, [comment_id, user_id, post_id, vote]).catch(err => { console.error(err) })
        console.log("result of vote query: " + JSON.stringify(results!.rows))
        //update the vote count in the comments table
        if (results!.rows) {
            this.updateVoteCount(results!.rows[0].vote, vote, comment_id, conn)
            conn.release();
            return true
        }
        conn.release();
        return false
    }

    async deleteVote(comment_id: number, user_id: number, vote: number) {
        console.log("about to delete vote comment: " + comment_id + " " + user_id)
        const conn = await client.connect();
        //insert the upvote instance
        let sql = 'DELETE FROM comment_upvotes WHERE comment_id=($1) AND user_id=($2) RETURNING (SELECT vote FROM comment_upvotes WHERE comment_id=($1) AND user_id=($2)) ';
        const results = await conn.query(sql, [comment_id, user_id]).catch(err => { console.error(err) })
        console.log("result of delete vote query: " + JSON.stringify(results))
        //update the vote count in the comments table
        if (results!.rows) {
            this.updateVoteCount(results!.rows[0].vote, vote, comment_id, conn)
            conn.release();
            return true
        }
        conn.release();
        return false
    }

    private async updateVoteCount(oldVote: number, newVote: number, comment_id: number, conn: any) {

        //if oldvote is undefined, that means there was no old vote (unvoted), which isn't recorded hence the undefined
        if (!oldVote) oldVote = 0;

        if (Number.isInteger(newVote) && comment_id) {
            //See effect of vote on vote count
            const voteCountChange = this.voteChange(newVote, oldVote)
            console.log("votecountchange: " + voteCountChange)
            //change the vote count
            const sql = 'UPDATE comments SET votes = votes + ($1) WHERE id=($2) RETURNING *'
            const result = await conn.query(sql, [voteCountChange, comment_id])
            console.log("update vote result: " + result.rows[0]);

            return true
        }
        return false

    }

    async userVotes(post_id: number, user_id: number): Promise<comment[]> {
        const conn = await client.connect();
        const sql = 'SELECT * FROM comment_upvotes WHERE post_id=($1) AND user_id=($2)';
        const results = await conn.query(sql, [post_id, user_id]);
        conn.release();
        return results.rows;
    }

}
