import client from "../database.js";

export type form = {
  id?: Number;
  user_id: Number;
  title: string;
  form: string;
  live: boolean
};

export class formsStore {
  async create(form: form): Promise<form> {
    try {
      const conn = await client.connect();

      //      const sql = 'INSERT INTO comment_upvotes (comment_id, user_id, post_id, vote) VALUES ($1, $2, $3, $4) ON CONFLICT (comment_id, user_id) DO UPDATE SET vote=($4) RETURNING (SELECT vote FROM comment_upvotes WHERE comment_id=($1) AND user_id=($2)) ';
      const sql =
        "INSERT INTO forms (user_id, title, form, live) VALUES ($1, $2, $3, $4) ON CONFLICT (title, user_id) DO UPDATE SET form=($3), live=($4) RETURNING *";
      //without json.stringify, JSON is stored with \" instead of "
      const results = await conn.query(sql, [
        form.user_id,
        form.title,
        JSON.stringify(form.form),
        form.live
      ]);
      conn.release();

      return results.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async update(form: form): Promise<form> {
    try {
      const conn = await client.connect();

      const sql = "UPDATE forms SET title = ($1), form = ($2), live = ($3) WHERE id = ($4) AND user_id = ($5) RETURNING *";
      //without json.stringify, JSON is stored with \" instead of "
      const results = await conn.query(sql, [
        form.title,
        JSON.stringify(form.form),
        form.live,
        form.id,
        form.user_id
      ]);
      conn.release();
      return results.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async getForm(id: number): Promise<form> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM forms WHERE id=($1)";
      const results = await conn.query(sql, [id]);
      conn.release();
      return results.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async getUserForms(id: number): Promise<form[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM forms WHERE user_id=($1)";
      const results = await conn.query(sql, [id]);
      conn.release();
      return results.rows;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
