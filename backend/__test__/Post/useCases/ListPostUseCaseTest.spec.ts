import { Post } from "@prisma/client";
import Pagination from "../../../src/shared/classes/Pagination";
import PostModelFactory from "../../factories/Post/PostModelFactory";
import PostRepository from "../../../src/Post/repositories/PostRepository";
import ListPostsUseCase from '../../../src/Post/useCases/ListPostsUseCase';

jest.mock('../../../src/Post/repositories/PostRepository', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        list:   jest.fn(),
        findById: jest.fn()
    })),
}));

describe("ListPostsUseCase",()=>{
    it("Should return paginated Posts", async()=>{

        //Arrange
        const pageSize = 10;
        const mockPosts = Array.from({ length: pageSize }, (_, index) => (new PostModelFactory().build()));
        const paginatedPosts = new Pagination<Post>({
            page:1,
            totalPages:10,
            offset:0,
            pageSize:10,
            data:mockPosts
        })
        const postRepository = new PostRepository();

        (postRepository.list as jest.Mock).mockResolvedValue(paginatedPosts);
        const page = 1;

        const listPostsUseCase = new ListPostsUseCase(postRepository);

        //Act
        const foundPosts = await listPostsUseCase.execute(page, 10);

        //Assert
        expect(foundPosts).toBeDefined();
        expect(foundPosts.data).toHaveLength(pageSize);
    })
})