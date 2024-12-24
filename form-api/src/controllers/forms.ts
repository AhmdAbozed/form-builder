import e, { Request, Response } from "express";
import { getIdFromToken } from "../util/util.js";
import { formsStore, form } from "../models/forms.js";
import dotenv from "dotenv";
import Router from "express";
import { tokenClass } from "../util/tokenauth.js";
import { BaseError } from "../util/errorHandler.js";
dotenv.config();

const tokenFuncs = new tokenClass();

const store = new formsStore();

const postForm = async (req: Request, res: Response, next: any) => {
  try {
    const user_id = getIdFromToken(req);
    if (user_id) {
      const form: form = {
        user_id: user_id,
        title: req.body.title,
        form: req.body.form,
        live: req.body.live,
      };
      console.log('new form is: ',form)
      const result = await store.create(form);
      if (result) {
        res.send(result);

        return;
      }
    } else {
      throw new BaseError(400, "Failed to post form, invalid user id");
    }
  } catch (err) {
    next(err);
  }
};

const updateForm = async (req: Request, res: Response, next: any) => {
  try {
    const user_id = getIdFromToken(req);
    if(!Number(req.params.form_id)) throw new BaseError(400, "Failed to update form, invalid form id");
    if (user_id) {
      const form: form = {
        id: Number(req.params.form_id),
        user_id: user_id,
        title: req.body.title,
        form: req.body.form,
        live: req.body.live,
      };
      console.log('updating form: ',form)
      const result = await store.update(form);
      if (result) {
        res.send(result);

        return;
      }else{
        throw new BaseError(400, "Failed to update form, form not found");
      }
    } else {
      throw new BaseError(400, "Failed to update form, invalid user id");
    }
  } catch (err) {
    next(err);
  }
};
const getForm = async (req: Request, res: Response, next: any) => {
  try {
    if (Number(req.params.id)) {
      const form_id = Number(req.params.id);
      console.log("form_id: " + form_id);
      const result = await store.getForm(form_id);
      
      if (result) {
        if (result.live) {
          res.send(result);
        }else{
            throw new BaseError(401, "Form is not accepting responses")
        }
      } else {
        res.sendStatus(404);
        return;
      }
    } else {
      throw new BaseError(
        400,
        "Failed to get form, invalid/missing url parameters"
      );
    }
  } catch (err) {
    next(err);
  }
};

const getUserForms = async (req: Request, res: Response, next: any) => {
  try {
    if (JSON.parse(req.cookies.refreshTokenExists).user_id) {
      const user_id = JSON.parse(req.cookies.refreshTokenExists).user_id;
      const result = await store.getUserForms(user_id);
      if (result) {
        console.log('result of get forms: ',result)
        res.send(result);
        return;
      } else {
        res.sendStatus(404);
        return;
      }
    } else {
      console.log(
        "user id: " + JSON.parse(req.cookies.refreshTokenExists).user_id
      );
      throw new BaseError(400, "Failed to get form, invalid/missing user id");
    }
  } catch (err) {
    next(err);
  }
};
const FormsRouter = Router();

FormsRouter.get("/forms/:id", getForm);
//.bind() binds 'this' inside verifyAT to tokenFuncs object

FormsRouter.get(
  "/forms/",
  tokenFuncs.verifyAllTokens.bind(tokenFuncs),
  getUserForms
);
FormsRouter.post(
  "/forms",
  tokenFuncs.verifyAllTokens.bind(tokenFuncs),
  postForm
);
FormsRouter.post(
  "/forms/update/:form_id",
  tokenFuncs.verifyAllTokens.bind(tokenFuncs),
  updateForm
);

export default FormsRouter;
