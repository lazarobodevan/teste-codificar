class InvalidTokenException extends Error{
    constructor(message = "Token inválido"){
        super(message);
    }
}

export default InvalidTokenException;