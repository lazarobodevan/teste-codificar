class PostCannotBeEmptyException extends Error{
    constructor(message = "Post não pode ser vazio"){
        super(message);
    }
}

export default PostCannotBeEmptyException;