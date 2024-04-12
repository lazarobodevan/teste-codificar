import InvalidCredentialsException from "../../shared/exceptions/InvalidCredentialsException";
import UserLoginDTO from "../DTOs/UserLoginDTO";
import UserDoesNotExistException from "../exceptions/UserDoesNotExistException";
import IUserRepository from "../repositories/IUserRepository";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class LoginUseCase{
    private readonly userRepository: IUserRepository;

    constructor(
        _userRepository: IUserRepository,
    ){
        this.userRepository = _userRepository;
    }

    async execute(email:string, password:string): Promise<UserLoginDTO>{
        try{
            const user = await this.userRepository.findByEmail(email);

            if(!user){
                throw new UserDoesNotExistException();
            }

            const verifyPass = await bcrypt.compare(password, user.password);

            if(!verifyPass){
                throw new InvalidCredentialsException()
            }

            const token = jwt.sign({id:user.id},process.env.JWT_PASS ?? "", {expiresIn:'7d'})
            const {password:_, ...loggedUser} = user;
            return {
                user: loggedUser,
                token: token
            }as UserLoginDTO;

        }catch(e){
            throw e;
        }
    }
}

export default LoginUseCase;