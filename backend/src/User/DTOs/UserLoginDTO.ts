import { User } from "@prisma/client";
import ListUserDTO from "./ListUserDTO";

class UserLoginDTO{
    user: ListUserDTO;
    token: string;

    constructor(user:User, token:string){
        this.user = {
            id: user.id,
            email: user.email,
            name: user.name
        }as ListUserDTO;
        this.token = token;
    }
}

export default UserLoginDTO;