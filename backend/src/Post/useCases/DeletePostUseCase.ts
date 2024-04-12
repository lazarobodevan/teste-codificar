import { Post } from "@prisma/client";
import PostDoesNotExistException from "../exceptions/PostDoesNotExistException";
import IPostRepository from "../repositories/IPostRepository";
import UnauthorizedException from "../../shared/exceptions/UnauthorizedException";

class DeletePostUseCase{
    private readonly postRepository: IPostRepository;

    constructor(
        _postRepository: IPostRepository
    ){
        this.postRepository = _postRepository;
    }

    async execute(id: string, authorId:string):Promise<Post>{
        try{
            const isPostExist = await this.postRepository.findById(id);
            if(!isPostExist){
                throw new PostDoesNotExistException();
            }

            if(isPostExist.authorId != authorId){
                throw new UnauthorizedException();
            }

            const deletedPost = await this.postRepository.delete(id, authorId);
            return deletedPost;

        }catch(e){
            throw e;
        }
    }
}

export default DeletePostUseCase;