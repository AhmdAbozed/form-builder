/*
  Cookies are httponly for security but frontend needs to know if they exist for access control
  so similar but empty cookies are sent at the same time
*/

/*
  Access tokens are stateless but expire after a short time ex: 5 mins
  To create new access token every 5 mins, you need refresh token.
  Refresh tokens are stateful and are stored in DB. They expire after a long time ex: 7 days. They're created on login 
  This combines the efficency of stateless tokens with the security of stateful tokens 

  The auth flow: 
    verify Access Token
      exists: auth
      else:
        verify Refresh Token as well as the DB
          exists: create new access token then auth
          else: 
            remove token cookies then 403
  
  after logging in flow:
    create refresh token and store it in DB
    create access token
    add both to cookies then auth
  */

import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
import client from "../database.js";
import { user } from "../models/users.js";
import { BaseError, sendError } from "./errorHandler.js";
import { clearCookies } from "./util.js";
dotenv.config();

const { tokenSecret } = process.env;
class tokenClass {
  async createAccessToken(req: Request, res: Response, next?: any) {
    const refreshTokenVerified = await this.verifyRefreshTokenDB(res, req.cookies.refreshToken);
    if (refreshTokenVerified) {
      console.log("Inside createAccessToken");
      const options = {
        expires: new Date(Date.now() + 10 * 60 * 1000),
        secure: false,
        httpOnly: true,
      };

      const token = jwt.sign({ data: "inside access" }, tokenSecret as string);

      res.cookie("accessToken", token, options);

      //empty cookie to tell the frontend the httponly cookies exist, to determine if user is logged in
      res.cookie("accessTokenExists", "", {
        expires: new Date(Date.now() + 10 * 60 * 1000),
        secure: false,
        httpOnly: false,
      });
      if (typeof next == "function") {
        //function is either called independently or part of middleware, then it has a next
        console.log("next found inside createaccesstoken");
        next();
        return;
      }
      res.status(200).send(JSON.stringify("access token created"));
    } else {
      throw new BaseError(401, "refresh token missing/expired.");
    }
  }

  async createRefreshToken(req: Request, res: Response, user: user): Promise<any> {
    console.log("inside createrefresh");

    const token = jwt.sign({ user: user.username, user_id: user.id }, tokenSecret as string);
    const conn = await client.connect();
    const sql = "INSERT INTO refreshtokens (user_id, token) VALUES ($1, $2) RETURNING *";
    const results = await conn.query(sql, [user.id, token]);
    conn.release();

    const options = {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      secure: false,
      httpOnly: true,
    };
    res.cookie("refreshToken", token, options);
    res.cookie("refreshTokenExists", JSON.stringify({ user_id: user.id }), {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      secure: false,
      httpOnly: false,
    });

    console.log("set refresh token cookies");
    //this.createAccessToken(req, res);
  }

  verifyTokensJWT(req: Request, res: Response, next: any) {
    console.log("inside verifytokensJWT");

    if (req.cookies.refreshToken) {
      if (!this.verifyTokenJWT(req.cookies.refreshToken, tokenSecret!)) {
        clearCookies(res);
        throw new BaseError(403, "Refresh Token Invalid");
      }
    } else {
      clearCookies(res);
      throw new BaseError(403, "Refresh Token missing");
    }

    if (req.cookies.accessToken && this.verifyTokenJWT(req.cookies.accessToken, tokenSecret!)) {
      console.log("Access Token verified");
      next();
    } else {
      this.createAccessToken(req, res, next);
    }
  }

  verifyTokenJWT(token: string, secret: Secret) {
    jwt.verify(token, secret, function (err) {
      if (err?.message == "invalid signature") {
        console.log(JSON.stringify(err));
        return false;
      }
    });
    return true;
  }
  async verifyRefreshTokenDB(res: Response, refreshToken: string) {
    console.log("inside verifyrefresh");

    try {
      if (refreshToken) {
        const conn = await client.connect();
        const sql = "SELECT FROM refreshtokens wHERE token=($1)";
        const results = await conn.query(sql, [refreshToken]);
        conn.release();
        console.log("result of refresh query: " + results.rows);
        if (results.rows[0]) {
          return true;
        } else {
          console.log("refresh token not in DB");
          return false;
        }
      } else {
        //no token in cookie
        console.log("refresh token missing/expired");
        throw new BaseError(401, "refresh token missing/expired.");
      }
    } catch (error) {
      console.log("Caught error in refresh: " + JSON.stringify(error));
      throw new Error(JSON.stringify(error));
    }
  }
}

export { tokenClass };
