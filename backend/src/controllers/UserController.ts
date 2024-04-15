import { Request, Response } from "express";
import IUserRepository from "../User/repositories/IUserRepository";
import CreateUserUseCase from "../User/useCases/CreateUserUseCase";
import RequestWithUserData from "../User/interfaces/RequestWithUserData";
import UserAlreadyExsitsException from "../User/exceptions/UserAlreadyExistsException";
import LoginUseCase from "../User/useCases/LoginUseCase";
import InvalidCredentialsException from "../shared/exceptions/InvalidCredentialsException";
import { applicationLogger, cliLogger } from "../utils/Logger";

class UserController{

    private readonly userRepository: IUserRepository;
    private readonly createUserUseCase: CreateUserUseCase;
    private readonly loginUseCase: LoginUseCase;

    constructor(
        _userRepository: IUserRepository,
    ){
        this.userRepository = _userRepository;
        this.createUserUseCase = new CreateUserUseCase(this.userRepository);
        this.loginUseCase = new LoginUseCase(this.userRepository);
    }

    createUser = async(req:RequestWithUserData, res:Response)=>{
        try{
            const createUserDTO = req.createUserDTO;
            

            const createdUser = await this.createUserUseCase.execute(createUserDTO!);

            cliLogger.info("Create user called");
            return res.status(201).json(createdUser);

        }catch(e){
            cliLogger.error("Failed to create user");
            applicationLogger.error("Failed to create user",e);
            if(e instanceof UserAlreadyExsitsException){
                return res.status(400).json({error: e.message});
            }
            return res.status(500).json({error:e})
        }
    }

    login = async (req:Request, res:Response) =>{
        try{
            const {email, password} = req.body;
            
            const loggedUser = await this.loginUseCase.execute(email, password);

            cliLogger.info("Login called");
            return res.status(200).json(loggedUser);

        }catch(e:any){
            cliLogger.error("Failed to login");
            applicationLogger.error("Failed to login", e);
            if(e instanceof InvalidCredentialsException){
                return res.status(400).json({error:e.message});
            }

            return res.status(500).json({error:e.message})
        }
        
    }


}

export default UserController;