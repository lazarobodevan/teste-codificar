import { User } from "@prisma/client";
import { randomUUID } from "crypto";

class UserModelFactory{
    user = {
        id: randomUUID(),
        name: "test",
        email: "test@test.com",
        password: "123"
    } as User;

    public build(){
        return this.user;
    }

    public withId(id: string){
        this.user.id = id;
        return this;
    }

    public withName(name:string){
        this.user.name = name;
        return this;
    }

    public withEmail(email: string){
        this.user.email = email;
        return this;
    }

    public withPassword(password: string){
        this.user.password = password;
        return this;
    }
}

export default UserModelFactory;