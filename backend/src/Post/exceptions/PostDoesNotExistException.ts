class PostDoesNotExistException extends Error{
    constructor(message = "Post não existe"){
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = PostDoesNotExistException.name
    }
}

export default PostDoesNotExistException;