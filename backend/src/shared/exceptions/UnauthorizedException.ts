class UnauthorizedException extends Error{
    constructor(message = "Usuario não autorizado"){
        super(message);
    }
}

export default UnauthorizedException;