class InvalidCredentialsException extends Error{
    constructor(message = "Email ou senha inválidos"){
        super(message);
    }
}

export default InvalidCredentialsException;