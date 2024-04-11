import { Post } from "@prisma/client";
import IPostRepository from "./IPostRepository";
import connection from '../../context/databaseContext/index'
import PostDoesNotExistException from "../exceptions/PostDoesNotExistException";
import Pagination from "../../shared/classes/Pagination";

class PostRepository implements IPostRepository{
    
    async create(post:Partial<Post>):Promise<Post>{
        try{
            const createdPost = await connection.post.create(
                {data:{
                    authorId: post.authorId!,
                    content: post.content!,
                }});

            return createdPost;
        }catch(e){
            throw e;
        }
    }
    
    async update(content:string, id:string):Promise<Post>{
        try{
            const isPostExist = await connection.post.findUnique({where:{id:id}});
            if(!isPostExist){
                throw new PostDoesNotExistException();
            }
            const updatedPost = await connection.post.update({data:{content:content},where:{id:id}});

            return updatedPost;
        }catch(e){
            throw e;
        }
    }
    
    async delete(id:string):Promise<Post>{
        try{
            const isPostExist = await connection.post.findUnique({where:{id:id}});
            if(!isPostExist){
                throw new PostDoesNotExistException();
            }

            const deletedPost = await connection.post.delete({where:{id:id}});
            return deletedPost;
        }catch(e){
            throw e;
        }
    }

    async list(page:number, pageSize:number):Promise<Pagination<Post>>{
        try{
            const offset = (page - 1) * pageSize;
            const posts = await connection.post.findMany({
                skip: offset,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include:{author:true}
            });

            return new Pagination<Post>({
                page: page,
                pageSize:pageSize,
                offset:offset,
                data:posts
            });
        }catch(e){
            throw e;
        }
    }
}

export default PostRepository;