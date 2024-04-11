import { Prisma, User } from "@prisma/client";
import IUserRepository from "./IUserRepository";
import connection from '../../context/databaseContext/index'
import UserAlreadyExsitsException from "../exceptions/UserAlreadyExistsException";

class UserRepository implements IUserRepository{
    
    constructor(){}

    async create(user: Partial<User>): Promise<User> {
        try{

            let newUser = await connection.user.create({data:{name:user.name!, email: user.email!, password: user.password!}});
            return newUser;

        }catch(e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                if(e.code === "P2002"){
                    throw new UserAlreadyExsitsException();
                }
            }
            throw e;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try{
            let possibleUser = await connection.user.findUnique({where:{email:email}})
            return possibleUser;
        }catch(e){
            throw e;
        }
    }

    findById(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

}

export default UserRepository;