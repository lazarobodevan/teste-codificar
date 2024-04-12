import { Request, Response } from "express";
import IUserRepository from "../User/repositories/IUserRepository";
import CreateUserUseCase from "../User/useCases/CreateUserUseCase";
import RequestWithUserData from "../User/interfaces/RequestWithUserData";
import UserAlreadyExsitsException from "../User/exceptions/UserAlreadyExistsException";
import LoginUseCase from "../User/useCases/LoginUseCase";
import InvalidCredentialsException from "../shared/exceptions/InvalidCredentialsException";

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

            return res.status(201).json(createdUser);

        }catch(e){
            if(e instanceof UserAlreadyExsitsException){
                return res.status(400).json({error: e.message});
            }
            console.log(e);
            return res.status(500).json({error:e})
        }
    }

    login = async (req:Request, res:Response) =>{
        try{
            const {email, password} = req.body;
            
            const loggedUser = await this.loginUseCase.execute(email, password);
            return res.status(200).json(loggedUser);

        }catch(e:any){
            if(e instanceof InvalidCredentialsException){
                return res.status(400).json({error:e.message});
            }

            return res.status(500).json({error:e.message})
        }
        
    }


}

export default UserController;