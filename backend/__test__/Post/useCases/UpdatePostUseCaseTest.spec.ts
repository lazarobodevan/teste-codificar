import PostRepository from "../../../src/Post/repositories/PostRepository";
import PostModelFactory from "../../factories/Post/PostModelFactory";
import UpdatePostUseCase from '../../../src/Post/useCases/UpdatePostUseCase'
import UpdatePostDTO from "../../../src/Post/DTOs/UpdatePostDTO";
import { randomUUID } from "crypto";
import PostDoesNotExistException from "../../../src/Post/exceptions/PostDoesNotExistException";
import Consts from "../../../src/shared/classes/consts";
import PostExceedsLimitOfContentLength from "../../../src/Post/exceptions/PostExceedsLimitOfContentLength";

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

describe("UpdatePostUseCase", () =>{
    it("Should update post successfully", async()=>{

        //Arrange
        const post = new PostModelFactory().build();
        const newContent = "New content test"
        const expectedNewPost = new PostModelFactory()
            .withId(post.id)
            .withAuthorId(post.authorId)
            .withCreatedAt(post.createdAt)
            .withContent(newContent)
            .build();
        const updateDTO = {
            authorId: post.authorId,
            content: newContent,
            postId: post.id
        } as UpdatePostDTO;
        const postRepository = new PostRepository();
        const updatePostUseCase = new UpdatePostUseCase(postRepository);

        (postRepository.findById as jest.Mock).mockResolvedValue(post);
        (postRepository.update as jest.Mock).mockResolvedValue(expectedNewPost);
        
        //Act
        const updatedPost = await updatePostUseCase.execute(updateDTO);

        //Assert
        expect(updatedPost.content).not.toEqual(post.content);
    });

    it("Should fail to update not existent post and throw PostDoesNotExistException", async()=>{

        //Arrange
        const updateDTO = {
            content: "test",
            postId: randomUUID()
        } as UpdatePostDTO;

        const postRepository = new PostRepository();
        const updatePostUseCase = new UpdatePostUseCase(postRepository);

        (postRepository.findById as jest.Mock).mockResolvedValue(null);

        try{
            const updatedPost = await updatePostUseCase.execute(updateDTO);
            fail("Should've thrown PostDoesNotExistException");
        }catch(e){
            expect(e).toBeInstanceOf(PostDoesNotExistException);
        }

    });

    it(`Should fail to update with content lenght more than ${Consts.POST_CONTENT_MAX_LENGTH} and throw PostExceedsLimitOfContentLength`, async()=>{

        //Generating content with its maximum length + 1
        let content = "";
        for(let i = 0; i < Consts.POST_CONTENT_MAX_LENGTH +1; i++){
            content += "A"
        }
        //Arrange
        const updateDTO = {
            content: content,
            postId: randomUUID()
        } as UpdatePostDTO;

        const postRepository = new PostRepository();
        const updatePostUseCase = new UpdatePostUseCase(postRepository);

        try{
            const updatedPost = await updatePostUseCase.execute(updateDTO);
            fail("Should've thrown PostDoesNotExistException");
        }catch(e){
            expect(e).toBeInstanceOf(PostExceedsLimitOfContentLength);
        }

    })
})