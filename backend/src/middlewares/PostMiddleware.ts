import { NextFunction, Request, Response } from "express";
import Consts from "../shared/classes/consts";

class PostMiddleware{

    validateContent(req:Request, res:Response, next:NextFunction){
        const {content} = req.body;

        if(!content || (content as string).length < 1){
            return res.status(400).json({error:"Conteúdo é obrigatório"});
        }

        if((content as string).length > Consts.POST_CONTENT_MAX_LENGTH){
            return res.status(400).json({error:`Conteúdo não pode exceder ${Consts.POST_CONTENT_MAX_LENGTH} caracteres`});
        }

        next();
    }

}

export default PostMiddleware;