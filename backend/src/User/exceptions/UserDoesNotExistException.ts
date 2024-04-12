class UserDoesNotExistException extends Error{
    constructor(message = "Usuário não existe"){
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = UserDoesNotExistException.name
    }
}

export default UserDoesNotExistException;