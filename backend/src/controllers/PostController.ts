import { Request, Response } from "express";
import IPostRepository from "../Post/repositories/IPostRepository";
import CreatePostUseCase from "../Post/useCases/CreatePostUseCase";
import IUserRepository from "../User/repositories/IUserRepository";
import CreatePostDTO from "../Post/DTOs/CreatePostDTO";
import UserDoesNotExistException from "../User/exceptions/UserDoesNotExistException";
import PostExceedsLimitOfContentLength from "../Post/exceptions/PostExceedsLimitOfContentLength";
import UpdatePostUseCase from "../Post/useCases/UpdatePostUseCase";
import UpdatePostDTO from "../Post/DTOs/UpdatePostDTO";
import UnauthorizedException from "../shared/exceptions/UnauthorizedException";
import PostDoesNotExistException from "../Post/exceptions/PostDoesNotExistException";
import DeletePostUseCase from "../Post/useCases/DeletePostUseCase";
import ListPostsUseCase from "../Post/useCases/ListPostsUseCase";
import { applicationLogger, cliLogger } from "../utils/Logger";
import PostCannotBeEmptyException from "../Post/exceptions/PostCannotBeEmptyException";

class PostController{

    private readonly createPostUseCase: CreatePostUseCase;
    private readonly updatePostUseCase: UpdatePostUseCase;
    private readonly deletePostUseCase: DeletePostUseCase;
    private readonly listPostsUseCase: ListPostsUseCase;

    constructor(
        _createPostUseCase: CreatePostUseCase,
        _updatePostUseCase: UpdatePostUseCase,
        _deletePostUseCase: DeletePostUseCase,
        _listPostsUseCase: ListPostsUseCase

    ){
        this.createPostUseCase = _createPostUseCase;
        this.updatePostUseCase = _updatePostUseCase;
        this.deletePostUseCase = _deletePostUseCase;
        this.listPostsUseCase = _listPostsUseCase;
    }

    createPost = async(req:Request, res:Response) =>{
        try{
            const {content} = req.body;
            const user = req.user;

            const createPostDTO = {
                authorId: user.id!,
                content: content
            } as CreatePostDTO;

            cliLogger.info("Create post was called");
            const createdPost = await this.createPostUseCase.execute(createPostDTO);
            
            return res.status(201).json(createdPost);

        }catch(e:any){
            applicationLogger.error("Failed to create post", e);
            cliLogger.error("Failed to create post",e);
            
            if(e instanceof UserDoesNotExistException){
                return res.status(400).json({error: e.message});
            }
            if(e instanceof PostExceedsLimitOfContentLength){
                return res.status(400).json({error: e.message});
            }
            if(e instanceof PostCannotBeEmptyException){
                return res.status(400).json({error: e.message});
            }
            return res.status(500).json({error:e.message})
        }
    }

    updatePost = async(req:Request, res:Response)=>{
        try{
            const {content} = req.body;
            const {id} = req.params;
            const user = req.user;

            const updateDTO = {
                authorId: user.id,
                content: content,
                postId: id
            } as UpdatePostDTO;

            cliLogger.info("Update post was called");
            const updatedPost = await this.updatePostUseCase.execute(updateDTO);


            return res.status(200).json(updatedPost);

        }catch(e:any){
            applicationLogger.error("Failed to update post", e);
            cliLogger.error("Failed to update post",e);
            
            if(e instanceof UnauthorizedException){
                return res.status(400).json({error:e.message});
            }
            if(e instanceof PostDoesNotExistException){
                return res.status(400).json({error: e.message});
            }
            if(e instanceof PostCannotBeEmptyException){
                return res.status(400).json({error:e.message});
            }
            return res.status(500).json({error: e.message});
        }
    }

    deletePost = async(req:Request, res:Response)=>{
        try{
            const {id} = req.params;
            const user = req.user;

            cliLogger.info("Delete post was called");
            const deletedPost = await this.deletePostUseCase.execute(id, user.id!);

            return res.status(200).json(deletedPost);

        }catch(e:any){
            applicationLogger.error("Failed to delete post", e);
            cliLogger.error("Failed to delete post",e);
            
            if(e instanceof PostDoesNotExistException){
                return res.status(400).json({error:e.message});
            }
            if(e instanceof UnauthorizedException){
                return res.status(403).json({error:e.message});
            }
            return res.status(500).json({error:e.message});
        }
    }

    listPosts = async(req:Request, res:Response)=>{
        try{
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 0;
            const pageSize = 8;

            cliLogger.info("List posts was called");
            const posts = await this.listPostsUseCase.execute(page, pageSize);

            return res.status(200).json(posts);
        }catch(e:any){
            applicationLogger.error("Failed to list posts", e);
            cliLogger.error("Failed to list post",e);
            
            return res.status(500).json({error:e.message})
        }
    }
}

export default PostController;