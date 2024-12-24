import { Request, Response } from 'express'
import { submissionsStore, submission } from '../models/submissions.js';
import dotenv from 'dotenv'
import Router from 'express'
import { tokenClass } from '../util/tokenauth.js';
import { BaseError } from '../util/errorHandler.js';
import multer from 'multer'
dotenv.config()

const upload = multer({ dest: 'uploads/' })


const tokenFuncs = new tokenClass()


const store = new submissionsStore();

const postSubmission = async (req: Request, res: Response, next: any) => {
    try {
        if (Number(req.params.form_id)) {
            console.log("postsubmission req.body: " + req.body)
            const submission: submission = { form_id: req.params.form_id, form: req.body }
            const result = await store.create(submission)
            if (result) {
                res.sendStatus(200)
                return;
            }
        }
        else {
            throw new BaseError(400, "Failed to post submission, invalid/missing form_id url parameter")
        }
    }
    catch (err) {
        next(err)
    }
}

const getSubmission = async (req: Request, res: Response, next: any) => {
    try {
        if (Number(req.params.id)) {
            const submission_id = Number(req.params.id)
            console.log("submission_id: " + submission_id)
            const result = await store.getSubmission(submission_id)
            if (result) {
                console.log(result)
                res.send(result)
                return;
            }
            else {
                res.sendStatus(404)
                return;
            }
        } else {
            throw new BaseError(400, "Failed to get submission, invalid/missing url parameters")
        }

    }
    catch (err) {
        next(err)
    }
}


const getFormSubmissions = async (req: Request, res: Response, next: any) => {
    try {
        if (Number(req.params.form_id)) {
            const form_id = Number(req.params.form_id)
            console.log("submission_id: " + form_id)
            const result = await store.getFormSubmissions(form_id)
            if (result[0]) {
                console.log(result)
                res.send(result)
                return;
            }
            else {
                res.sendStatus(404)
                return;
            }
        } else {
            throw new BaseError(400, "Failed to get submission, invalid/missing url parameters")
        }

    }
    catch (err) {
        next(err)
    }
}
const SubmissionsRouter = Router();

SubmissionsRouter.get("/forms/:form_id/submissions/:id", getSubmission)

SubmissionsRouter.get("/forms/:form_id/submissions/", getFormSubmissions)
//.bind() binds 'this' inside verifyAT to tokenFuncs object
SubmissionsRouter.post("/forms/:form_id/submissions/", postSubmission)
export default SubmissionsRouter;

