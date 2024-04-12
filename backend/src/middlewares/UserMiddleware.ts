import { NextFunction, Request, Response } from "express";
import CreateUserDTO from "../User/DTOs/CreateUserDTO";
import RequestWithUserData from '../User/interfaces/RequestWithUserData';

class UserMiddleware{

    mapBodyToCreateUserDTO(req:Request, res:Response, next: NextFunction){
        const {name, email, password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!name)
            return res.status(400).json({error:"Campo nome é obrigatório"})

        if(!email)
            return res.status(400).json({error:"Campo email é obrigatório"})

        if(!password)
            return res.status(400).json({error:"Campo senha é obrigatório"})

        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Email em formato inválido"})
        }

        (req as RequestWithUserData).createUserDTO = new CreateUserDTO(name, email, password);
        
        next();
    }

    validateLoginBody(req:Request, res:Response, next: NextFunction){
        const {email, password} = req.body;
        if(!email)
            return res.status(400).json({error:"Campo email é obrigatório"})

        if(!password)
            return res.status(400).json({error:"Campo senha é obrigatório"})

        next();
    }
}

export default UserMiddleware;