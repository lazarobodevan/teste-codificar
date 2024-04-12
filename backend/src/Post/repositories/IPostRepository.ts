import { Post } from "@prisma/client";
import Pagination from "../../shared/classes/Pagination";

interface IPostRepository{
    create(post:Partial<Post>):Promise<Post>;
    update(content:string, id:string, authorId:string):Promise<Post>;
    delete(id:string, authorId:string):Promise<Post>;
    list(page:number, pageSize:number):Promise<Pagination<Post>>;
    findById(id:string):Promise<Post | null>;
}

export default IPostRepository;