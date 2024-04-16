import { Post } from "@prisma/client";
import IUserRepository from "../../User/repositories/IUserRepository";
import Consts from "../../shared/classes/consts";
import UpdatePostDTO from "../DTOs/UpdatePostDTO";
import PostDoesNotExistException from "../exceptions/PostDoesNotExistException";
import PostExceedsLimitOfContentLength from "../exceptions/PostExceedsLimitOfContentLength";
import IPostRepository from "../repositories/IPostRepository";
import UnauthorizedException from "../../shared/exceptions/UnauthorizedException";
import PostCannotBeEmptyException from "../exceptions/PostCannotBeEmptyException";

class UpdatePostUseCase{
    private readonly postRepository:IPostRepository;

    constructor(
        _postRepository: IPostRepository,
    ){
        this.postRepository = _postRepository;
    }

    async execute(updateDTO: UpdatePostDTO):Promise<Post>{
        try{
            if(updateDTO.content.length > Consts.POST_CONTENT_MAX_LENGTH){
                throw new PostExceedsLimitOfContentLength();
            }

            if(updateDTO.content.trim().length < 1){
                throw new PostCannotBeEmptyException();
            }

            const isPostExist = await this.postRepository.findById(updateDTO.postId);

            if(!isPostExist){
                throw new PostDoesNotExistException();
            }

            if(isPostExist.authorId != updateDTO.authorId){
                throw new UnauthorizedException();
            }

            const createdPost = await this.postRepository.update(updateDTO.content, updateDTO.postId, updateDTO.authorId);

            return createdPost;

        }catch(e){
            throw e;
        }
    }
}

export default UpdatePostUseCase;