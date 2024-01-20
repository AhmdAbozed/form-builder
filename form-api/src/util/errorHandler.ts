import { Request, Response, NextFunction } from 'express'

//Extending Error so that baseError also has stack logging
export class BaseError extends Error{
    statusCode:number;
    customMessage:string;
    constructor(code:number, desc:string){
        super();
        this.customMessage = desc;
        this.statusCode = code;
        
    }
}

//If caught error is unexpected/unknown (has undefined statusCode, not a custom error), exit the process, else handle it.

export const sendError = (err: BaseError,req: Request,res: Response,next:any)=>{
    if(!err.statusCode){
        console.error(err);
        res.status(500).send(JSON.stringify("Unexpected server error"))
        process.exit(1);
    }
    console.log("\nCAUGHT ERROR: \n"+err.stack + "\n CUSTOM MSG: "+ err.customMessage+ "\n END OF CAUGHT ERROR\n\n");
    res.status(err.statusCode).send(JSON.stringify(err.customMessage))
}