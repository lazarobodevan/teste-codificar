import IPostRepository from "../repositories/IPostRepository";
import Pagination from "../../shared/classes/Pagination";
import { Post } from "@prisma/client";
import CreatePostDTO from "../DTOs/createPostDTO";

class CreatePostUseCase{
    readonly postRepository:IPostRepository;

    constructor(
        _postRepository: IPostRepository
    ){
        this.postRepository = _postRepository;
    }

    async execute(createPostDTO: CreatePostDTO, authorId:string):Promise<ListPostDTO>{
        try{
            let postModel = {
                authorId: authorId,
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