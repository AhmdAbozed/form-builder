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
    add both to cookies
    complete login
  */


import { Request, Response } from 'express'
import dotenv from 'dotenv'
import jwt, { Secret } from 'jsonwebtoken'
import client from '../database.js'
import { user } from '../models/users.js'
import { BaseError, sendError } from './errorHandler.js'

dotenv.config()

const { tokenSecret } = process.env;
class tokenClass {

  createAccessToken(req: Request, res: Response, next?: any) {

    console.log("inside createaccess")
    const options = {
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      secure: false, //http or https, will change later
      httpOnly: true, //To prevent client-side access to cookies
    }


    const token = jwt.sign({ data: "inside access" }, tokenSecret as string)

    res.cookie('accessToken', token, options);

    //empty cookie to tell the frontend the httponly cookies exist, to determine if user is logged in
    res.cookie('accessTokenExists', "", {
      expires: new Date(Date.now() + 10 * 60 * 1000),
      secure: false,
      httpOnly: false,
    });
    if (typeof next == "function") {
      //function is either called independently or part of middleware, then it has a next
      console.log("next found inside createaccesstoken")
      next();
      return;
    }
    res.status(200).send(JSON.stringify("access and refresh created"))
  }

  async createRefreshToken(req: Request, res: Response, user: user, permission?: string): Promise<any> {
    console.log("inside createrefresh")
    const options = {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days
      secure: false, //http or https, will change later
      httpOnly: true, //To prevent client-side access to cookies
    }

    const token = jwt.sign({ user: user.username, user_id: user.id }, tokenSecret as string)
    const conn = await client.connect();
    const sql = 'INSERT INTO refreshtokens (user_id, token) VALUES ($1, $2) RETURNING *';
    const results = await conn.query(sql, [user.id, token]);
    conn.release();



    res.cookie('refreshToken', token, options);
    res.cookie('refreshTokenExists', JSON.stringify({ user_id: user.id }), {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days
      secure: false, //http or https, will change later
      httpOnly: false,
    })

    console.log("set refresh token cookies")
    this.createAccessToken(req, res, user);
    return;
  }


  verifyTokensJWT(req: Request, res: Response, next: any) {

    console.log("inside verifyaccess")
    if (req.cookies.refreshToken) {
      const token: string = req.cookies.refreshToken;
      jwt.verify(token, tokenSecret as Secret, function (err) {
        if (err?.message == "invalid signature") {
          console.log(JSON.stringify(err))
          res.clearCookie("refreshToken", { secure: false, httpOnly: true })
          res.clearCookie("refreshTokenExists", { secure: false, httpOnly: false })
          res.clearCookie("accessToken", { secure: false, httpOnly: true })
          throw new BaseError(403, err.message)
        }
      })
    } else {
      //no refresh token, let verifyrefresh handle it
      this.verifyRefreshTokenDB(req, res, next);
    }

    if (req.cookies.accessToken) {

      console.log("Accesstoken exists, verifying..")

      try {
        const token: string = req.cookies.accessToken;
        jwt.verify(token, tokenSecret as Secret, function (err, payload) {
          console.log(" access token error: " + JSON.stringify(err))
          if (err?.message) throw new Error(err.message)
        })
        console.log("Access Token verified")
        next()
      }
      catch (error: any) {

        console.log(JSON.stringify(error))
        //Error with access token, verify refresh token to create new access token
        this.verifyRefreshTokenDB(req, res, next)
      }
    }

    else { //no access token, verify that refresh exists in DB to create new access token
      console.log("Accesstoken doesn't exist")
      this.verifyRefreshTokenDB(req, res, next);
    }


  }




  async verifyRefreshTokenDB(req: Request, res: Response, next: any) {
    console.log("inside verifyrefresh")

    try {

      if (req.cookies.refreshToken) {
        const token: string = req.cookies.refreshToken;
        jwt.verify(token, tokenSecret as Secret, function (err) {
          if (err?.message == "invalid signature") {
            console.log(JSON.stringify(err))
            res.clearCookie("refreshToken", { secure: false, httpOnly: true })
            res.clearCookie("refreshTokenExists", { secure: false, httpOnly: false })
            res.clearCookie("accessToken", { secure: false, httpOnly: true })
            throw new BaseError(403, err.message)
          }
        })
        const conn = await client.connect();
        const sql = 'SELECT FROM refreshtokens wHERE token=($1)';
        const results = await conn.query(sql, [token]);
        conn.release();
        console.log("result of refresh query: " + results.rows)
        if (results.rows[0]) {

          this.createAccessToken(req, res, next)
        }
        else {//refreshtoken doesnt exist in db
          //according to express docs, the cookie's options excluding expiration must be included to clear it
          res.clearCookie("refreshToken", { secure: false, httpOnly: true })
          res.clearCookie("refreshTokenExists", { secure: false, httpOnly: false })
          throw new BaseError(401, "refresh token not found in DB, redirect to login")
        }

      }
      else {//no token in cookie
        throw new BaseError(401, "refresh token missing/expired.")
      }
    }
    catch (error) {
      console.log("CAUGHT ERROR IN REFRESH: " + JSON.stringify(error))
      next(error)
    }
  }
}


export {
  tokenClass
};