import { Post } from "@prisma/client";
import Pagination from "../../shared/classes/Pagination";

interface IPostRepository{
    create(post:Partial<Post>):Promise<Post>;
    update(content:string, id:string):Promise<Post>;
    delete(id:string):Promise<Post>;
    list(page:number, pageSize:number):Promise<Pagination<Post>>
}

export default IPostRepository;