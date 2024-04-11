class UserAlreadyExsitsException extends Error{
    constructor(message = "Usuário já existe"){
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = UserAlreadyExsitsException.name
    }
}
export default UserAlreadyExsitsException;