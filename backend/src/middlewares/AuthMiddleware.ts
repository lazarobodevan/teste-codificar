import { NextFunction, Request, Response } from "express";
import UnauthorizedException from "../shared/exceptions/UnauthorizedException";
import jwt from 'jsonwebtoken';
import UserRepository from "../User/repositories/UserRepository";
import { error } from "console";
import InvalidTokenException from "../shared/exceptions/InvalidTokenException";

type JwtPayload = {
    id: string
}

export const authMiddleware = async(req:Request, res:Response, next:NextFunction) =>{
    try{
        const {authorization} = req.headers;

        const userRepository = new UserRepository();

        if(!authorization){
            throw new UnauthorizedException();
        }

        const token = authorization.split(" ")[1];
        

        let id: string;
        try {
            const payload = jwt.verify(token, process.env.JWT_PASS ?? "") as JwtPayload;
            id = payload.id;
        } catch (error) {
            throw new InvalidTokenException();
        }

        if(!id){
            throw new InvalidTokenException();
        }

        const user = await userRepository.findById(id);

        if(!user){
            throw new UnauthorizedException();
        }

        const {password:_, ...loggedUser} = user;

        req.user = loggedUser;

        next();

    }catch(e:any){
        if(e instanceof UnauthorizedException){
            return res.status(403).json({error:e.message});
        }
        if(e instanceof InvalidTokenException){
            return res.status(400).json({error:e.message});
        }
        return res.status(500).json({error:e.message});
    }
}