import { Post } from "@prisma/client";
import Pagination from "../../shared/classes/Pagination";
import IPostRepository from "../repositories/IPostRepository";

class ListPostsUseCase{
    private readonly postRepository: IPostRepository;

    constructor(
        _postRepository:IPostRepository
    ){
        this.postRepository = _postRepository;
    }

    async execute(page:number, pageSize:number):Promise<Pagination<Post>>{
        try{
            const paginatedPosts = await this.postRepository.list(page, pageSize);

            return paginatedPosts;
        }catch(e){
            throw e;
        }
    }
}

export default ListPostsUseCase;