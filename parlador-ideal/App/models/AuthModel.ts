import User from "./User";

class AuthModel{
    constructor(
        public user?: Partial<User>,
        public token?:string
    ){}
}

export default AuthModel;