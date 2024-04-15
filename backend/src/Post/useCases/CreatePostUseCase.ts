import IPostRepository from "../repositories/IPostRepository";
import Pagination from "../../shared/classes/Pagination";
import { Post } from "@prisma/client";
import IUserRepository from "../../User/repositories/IUserRepository";
import PostExceedsLimitOfContentLength from "../exceptions/PostExceedsLimitOfContentLength";
import UserDoesNotExistException from "../../User/exceptions/UserDoesNotExistException";
import Consts from "../../shared/classes/consts";
import CreatePostDTO from "../DTOs/CreatePostDTO";


class CreatePostUseCase{
    readonly postRepository:IPostRepository;
    readonly userRepository:IUserRepository;

    constructor(
        _postRepository: IPostRepository,
        _userRepository: IUserRepository
    ){
        this.postRepository = _postRepository;
        this.userRepository = _userRepository;
    }

    async execute(createPostDTO: CreatePostDTO):Promise<Post>{
        try{
            if(createPostDTO.content.length > Consts.POST_CONTENT_MAX_LENGTH){
                throw new PostExceedsLimitOfContentLength();
            }

            const isUserExists = await this.userRepository.findById(createPostDTO.authorId);
            if(!isUserExists){
                throw new UserDoesNotExistException();
            }

            let postModel = {
                authorId: createPostDTO.authorId,
                content: createPostDTO.content,
            }as Partial<Post>;

            const createdPost = await this.postRepository.create(postModel);

            return createdPost;

        }catch(e){
            throw e;
        }
    }
}

export default CreatePostUseCase;