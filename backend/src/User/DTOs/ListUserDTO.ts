import { User } from "@prisma/client";

class ListUserDTO {
    id: string;
    name: string;
    email: string;

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
    }
}

export default ListUserDTO;