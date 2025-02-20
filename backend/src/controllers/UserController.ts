import { Request, Response } from "express";
import IUserRepository from "../User/repositories/IUserRepository";
import CreateUserUseCase from "../User/useCases/CreateUserUseCase";
import RequestWithUserData from "../User/interfaces/RequestWithUserData";
import UserAlreadyExsitsException from "../User/exceptions/UserAlreadyExistsException";
import LoginUseCase from "../User/useCases/LoginUseCase";
import InvalidCredentialsException from "../shared/exceptions/InvalidCredentialsException";
import { applicationLogger, cliLogger } from "../utils/Logger";
import UserDoesNotExistException from "../User/exceptions/UserDoesNotExistException";

class UserController{

    private readonly createUserUseCase: CreateUserUseCase;
    private readonly loginUseCase: LoginUseCase;

    constructor(
        _createUserUseCase: CreateUserUseCase,
        _loginUseCase: LoginUseCase
    ){
        this.createUserUseCase = _createUserUseCase;
        this.loginUseCase = _loginUseCase;
    }

    createUser = async(req:RequestWithUserData, res:Response)=>{
        try{
            const createUserDTO = req.createUserDTO;
            
            cliLogger.info("Create user called");
            const createdUser = await this.createUserUseCase.execute(createUserDTO!);

            return res.status(201).json(createdUser);

        }catch(e:any){
            if(e instanceof UserAlreadyExsitsException){
                return res.status(400).json({error: e.message});
            }
            cliLogger.error("Failed to create user");
            applicationLogger.error("Failed to create user",e);
            return res.status(500).json({error:e.message})
        }
    }

    login = async (req:Request, res:Response) =>{
        try{
            const {email, password} = req.body;
            
            cliLogger.info("Login called");
            const loggedUser = await this.loginUseCase.execute(email, password);
            return res.status(200).json(loggedUser);

        }catch(e:any){

            if(e instanceof InvalidCredentialsException){
                return res.status(403).json({error:e.message});
            }
            if(e instanceof UserDoesNotExistException){
                return res.status(403).json({error:e.message});
            }
            cliLogger.error("Failed to login");
            applicationLogger.error("Failed to login", e);
            return res.status(500).json({error:e.message})
        }
        
    }


}

export default UserController;