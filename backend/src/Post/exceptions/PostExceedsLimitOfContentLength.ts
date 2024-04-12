class PostExceedsLimitOfContentLength extends Error{
    constructor(message = "Post excede o limite de caracteres"){
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = PostExceedsLimitOfContentLength.name
    }
}

export default PostExceedsLimitOfContentLength;