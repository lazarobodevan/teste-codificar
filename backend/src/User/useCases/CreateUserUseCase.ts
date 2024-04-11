import { User } from "@prisma/client";
import CreateUserDTO from "../DTOs/CreateUserDTO";
import IUserRepository from "../repositories/IUserRepository";
import ListUserDTO from "../DTOs/ListUserDTO";
import UserAlreadyExsitsException from "../exceptions/UserAlreadyExistsException";

class CreateUserUseCase{
    private readonly userRepository:IUserRepository

    constructor(
        _userRepository:IUserRepository
    ){
        this.userRepository = _userRepository;
    }

    async execute(userDTO:CreateUserDTO):Promise<ListUserDTO>{
        try{
            const isUserExists = await this.userRepository.findByEmail(userDTO.email);
            if(isUserExists){
                throw new UserAlreadyExsitsException();
            }

            let userModel = {
                name: userDTO.name,
                email: userDTO.email,
                password: userDTO.password
            } as Partial<User>

            const createdUser = await this.userRepository.create(userModel);
            return new ListUserDTO(createdUser);
        }catch(e){
            throw e;
        }
    } 
}

export default CreateUserUseCase;