import { body, validationResult } from 'express-validator';
import { Router } from "express"
import { Request, Response } from 'express'
import { usersStore, user } from '../models/users.js';
import dotenv from 'dotenv'
import { tokenClass } from '../util/tokenauth.js';
import { BaseError } from '../util/errorHandler.js';
import { mailCode, mailCodeStore } from '../models/mailCode.js';
import { getIdFromToken, getRandomInt } from '../util/util.js';
import sendMailCode from '../util/nodemailer.js';
import { TokenClass } from 'typescript';
dotenv.config()


const tokenFuncs = new tokenClass()
const store = new usersStore();
const mailStore = new mailCodeStore()
const token = new tokenClass();
//See express-validator docs for, docs.

//No error handling for mailcode yet, assumes all nodemailer requests succeed
const createMailCode = async (user_id: number): Promise<any> => {
    const mailVerifyCode = getRandomInt(1000, 9999)
    const mailCodeResult = await mailStore.createMailCode({ user_id: user_id, code: mailVerifyCode })
    const result = await sendMailCode(mailVerifyCode)
    console.log("mail Sent")
    return result
}
const signUpPost = [

    body('Username')
        .matches(/^\w{4,20}$/).withMessage("Username must be 4-20 characters"),

    body('Email').isEmail().withMessage("Email invalid"),

    body('Password').matches(/^\w{4,20}$/).withMessage("Password must be 4-20 characters"),

    async function (req: Request, res: Response, next: any) {
        try {
            const errorArr = validationResult(req).array()

            if (errorArr[0]) {
                //An error is found
                let errorPrompt = "";
                for (const error of errorArr) {
                    errorPrompt += error.msg;
                }
                console.log("ErrorArr: " + JSON.stringify(errorArr))
                console.log("express-vali validationResult(req) " + validationResult(req))
                throw new BaseError(403, JSON.stringify(errorPrompt));

            }

            const submission: user = { username: req.body.Username, password: req.body.Password, email: req.body.Email }
            console.log("submission thing [signup]: " + JSON.stringify(submission))
            const validation = await store.validateSignUp(submission)

            if (validation[0]) {
                //username/email already exist
                console.log("recieved validation: " + JSON.stringify(validation[0]))
                let errorPrompt = "";
                for (const error of validation) {
                    errorPrompt += error.msg+'. ';
                }

                console.log("ErrorPrompt signup: " + JSON.stringify(errorPrompt))
                throw new BaseError(403, JSON.stringify(errorPrompt));
            } else {
                const result = await store.signup(submission)
                //const verifyCode = await createMailCode(result.id!)

                await token.createRefreshToken(req, res, result, next)
                res.send(200)
                console.log("result/End Of Sign Up Function: " + result)
            }


        }
        catch (err) {
            next(err)
        }
    }]

const signInPost = [

    body('Username')
        .matches(/^\w{4,20}$/).withMessage("Username must be 4-20 characters"),

    body('Password').matches(/^\w{4,20}$/).withMessage("Password must be 4-20 characters"),

    async function (req: Request, res: Response, next: any) {

        try {
            const errorArr = validationResult(req).array()

            if (errorArr[0]) {
                //An error is found
                let errorPrompt = "";
                for (const error of errorArr) {
                    errorPrompt += error.msg;
                }

                console.log("ErrorArr: " + JSON.stringify(errorArr))
                console.log("express-vali validationResult(req) " + validationResult(req))
                throw new BaseError(403, JSON.stringify(errorPrompt));
            }

            const submission: user = { username: req.body.Username, password: req.body.Password, email: req.body.Email }
            console.log("submission login thing: " + JSON.stringify(submission))

            const result = await store.signin(submission)

            //createToken(res, result)
            if (result[0]) {
                token.createRefreshToken(req, res, result[0], next)
            }
            else {
                throw new BaseError(403, "Incorrect Username or Password");
            }

            console.log("result/End Of Sign In Function: " + result)

        }

        catch (err) {
            next(err)
        }

    }
]

const signOut = async function (req: Request, res: Response, next: any) {
    res.clearCookie("refreshToken", { secure: false, httpOnly: true })
    res.clearCookie("refreshTokenExists", { secure: false, httpOnly: false })
    res.clearCookie("accessToken", { secure: false, httpOnly: true })
    res.clearCookie("accessTokenExists", { secure: false, httpOnly: false })

    res.sendStatus(200);
}

const verifyEmail = async function (req: Request, res: Response, next: any) {
    const user_id = Number(getIdFromToken(req))
    const result = await mailStore.getMailCode(user_id)
    console.log("entered code: " + req.body.mailCode + ", db code: " + result)
    if (req.body.mailCode == result) {
        res.sendStatus(200);

    } else {
        throw new BaseError(403, "Incorrect Verification Code");
    }
}
const resendEmailCode = async (req: Request, res: Response, next: any) => {
    try {
        const user_id = Number(getIdFromToken(req))
        const result = await createMailCode(user_id)
        if (result) {
            console.log("mail resolved")
            res.sendStatus(200)
        }
        else {
            throw new BaseError(400, "Failed to create code");
        }

    } catch (err) {
        next(err)
    }


}
const UsersRouter = Router()

UsersRouter.post("/users/signup", signUpPost);
UsersRouter.get("/users/signout", signOut);
UsersRouter.post("/users/signin", signInPost);
UsersRouter.post("/users/verifyemail", tokenFuncs.verifyAllTokens.bind(tokenFuncs), verifyEmail);
UsersRouter.post("/users/sendemailcode", tokenFuncs.verifyAllTokens.bind(tokenFuncs), resendEmailCode);

export default UsersRouter;
