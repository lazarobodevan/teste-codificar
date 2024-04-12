import { Post } from "@prisma/client";
import IPostRepository from "./IPostRepository";
import connection from '../../context/databaseContext/index'
import PostDoesNotExistException from "../exceptions/PostDoesNotExistException";
import Pagination from "../../shared/classes/Pagination";
import PostExceedsLimitOfContentLength from "../exceptions/PostExceedsLimitOfContentLength";
import Consts from "../../shared/classes/consts";

class PostRepository implements IPostRepository{
    
    async create(post:Partial<Post>):Promise<Post>{
        try{
            if(post.content!.length > Consts.POST_CONTENT_MAX_LENGTH){
                throw new PostExceedsLimitOfContentLength();
            }

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
    
    async update(content:string, id:string, authorId:string):Promise<Post>{
        try{
            if(content.length > Consts.POST_CONTENT_MAX_LENGTH){
                throw new PostExceedsLimitOfContentLength();
            }
            const updatedPost = await connection.post.update({data:{content:content},where:{id:id,authorId:authorId}});

            return updatedPost;
        }catch(e){
            throw e;
        }
    }
    
    async delete(id:string, authorId:string):Promise<Post>{
        try{
            const deletedPost = await connection.post.delete({where:{id:id,authorId:authorId}});
            return deletedPost;
        }catch(e){
            throw e;
        }
    }

    async list(page:number, pageSize:number):Promise<Pagination<Post>>{
        try{
            const totalPostsCount = await connection.post.count();
            const pageCount = Math.ceil(totalPostsCount / pageSize);
            page = Math.min(page, Math.floor(pageCount) - 1);

            const offset = Math.max(0, page) * pageSize;
            const posts = await connection.post.findMany({
                skip: offset,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include:{author:{
                    select:{
                        id:true,
                        name:true
                    }
                }}
            });

            return new Pagination<Post>({
                page: page,
                totalPages: pageCount,
                pageSize:pageSize,
                offset:offset,
                data:posts
            });
        }catch(e){
            throw e;
        }
    }

    async findById(id:string):Promise<Post | null>{
        try{
            const foundPost = await connection.post.findUnique({where:{id:id}});

            return foundPost;
        }catch(e){
            throw e;
        }
    }
}

export default PostRepository;