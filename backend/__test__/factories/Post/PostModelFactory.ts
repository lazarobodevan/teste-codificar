import { Post, User } from "@prisma/client";
import { randomUUID } from "crypto";

class PostModelFactory{
    
    post = {
        id: randomUUID(),
        authorId: randomUUID(),
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in lacus vulputate, suscipit sapien quis, dignissim neque. Sed vel euismod lacus, ut sagittis quam. Sed et ante justo. Ut sollicitudin non arcu ut pharetra. Nullam varius ligula enim, id tincidunt justo rutrum p.",
        createdAt: new Date(),
    }as Post

    public build(){
        return this.post;
    }

    public withId(id:string){
        this.post.id = id;
        return this;
    }

    public withAuthorId(id:string){
        this.post.authorId = id;
        return this;
    }

    public withContent(content:string){
        this.post.content = content;
        return this;
    }

    public withCreatedAt(createdAt: Date){
        this.post.createdAt = createdAt;
        return this;
    }

    public withUpdatedAt(updatedAt:Date){
        this.post.updatedAt = updatedAt;
        return this;
    }
}

export default PostModelFactory;