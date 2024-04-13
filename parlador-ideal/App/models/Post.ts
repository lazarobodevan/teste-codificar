import User from "./User";

class Post{
    constructor(
        public id:string,
        public content: string,
        public createdAt:Date,
        public author?:Partial<User>
    ){}
}

export default Post;