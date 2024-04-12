import { Prisma, User } from "@prisma/client";
import IUserRepository from "./IUserRepository";
import connection from '../../context/databaseContext/index'
import UserAlreadyExsitsException from "../exceptions/UserAlreadyExistsException";
import bcrypt from 'bcrypt';

class UserRepository implements IUserRepository{
    
    constructor(){}

    async create(user: Partial<User>): Promise<User> {
        try{

            let hashedPassword = await bcrypt.hash(user.password!,10);

            let newUser = await connection.user.create({data:{name:user.name!, email: user.email!, password: hashedPassword}});
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

    async findById(id: string): Promise<User | null> {
        try{
            let possibleUser = await connection.user.findUnique({where:{id:id}});
            return possibleUser;
        }catch(e){
            throw e;
        }
    }

}

export default UserRepository;