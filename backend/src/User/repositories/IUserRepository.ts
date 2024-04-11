import { User } from "@prisma/client"
interface IUserRepository{
    create(user:Partial<User>):Promise<User>;
    findById(id:string):Promise<User | null>;
    findByEmail(email:string):Promise<User | null>;
}

export default IUserRepository;