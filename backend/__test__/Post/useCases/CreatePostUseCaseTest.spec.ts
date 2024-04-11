import PostRepository from "../../../src/Post/repositories/PostRepository";
import CreatePostDTO from '../../../src/Post/DTOs/createPostDTO';
import CreatePostUseCase from '../../../src/Post/useCases/CreatePostUseCase';
import { randomUUID } from "crypto";
import PostModelFactory from "../../factories/Post/PostModelFactory";

jest.mock('../../../src/Post/repositories/PostRepository', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        list:   jest.fn()
    })),
}));

describe("CreatePostUseCase",()=>{
    it("Should create post successfully", async()=>{
        //Arrange
        const postDTO = {
            authorId: randomUUID(),
            content: "test"
        } as CreatePostDTO;

        const expectedCreatedPost = new PostModelFactory()
            .withAuthorId(postDTO.authorId)
            .withContent(postDTO.content)
            .build();

        const postRepository = new PostRepository();
        
        (postRepository.create as jest.Mock).mockResolvedValue(expectedCreatedPost)

        const createPostUseCase = new CreatePostUseCase(postRepository);

        //Act
        const createdPost = await createPostUseCase.execute(postDTO, postDTO.authorId);

        //Assert
        expect(createdPost).toEqual(expectedCreatedPost);
    })
})