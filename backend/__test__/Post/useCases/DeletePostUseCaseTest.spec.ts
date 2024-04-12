import PostRepository from "../../../src/Post/repositories/PostRepository";
import PostModelFactory from "../../factories/Post/PostModelFactory";
import DeletePostUseCase from '../../../src/Post/useCases/DeletePostUseCase';
import { randomUUID } from "crypto";
import PostDoesNotExistException from "../../../src/Post/exceptions/PostDoesNotExistException";

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

describe("DeletePostUseCase", ()=>{
    it("Should delete post successfully and return deleted post", async ()=>{
        
        //Arrange
        const post = new PostModelFactory().build();
        const postRepository = new PostRepository();
        const deletePostUseCase = new DeletePostUseCase(postRepository);

        (postRepository.findById as jest.Mock).mockResolvedValue(post);
        (postRepository.delete as jest.Mock).mockResolvedValue(post);

        //Act
        const deletedPost = await deletePostUseCase.execute(post.id, post.authorId);

        //Assert
        expect(deletedPost).toEqual(post);
    });

    it("Should fail to delete not existent post and throw PostDoesNotExistException", async()=>{
        
        //Arrange
        const postId = randomUUID();
        const postRepository = new PostRepository();
        const deletePostUseCase = new DeletePostUseCase(postRepository);

        (postRepository.findById as jest.Mock).mockResolvedValue(null);

        try{
            //Act
            const deletedPost = await deletePostUseCase.execute(postId, randomUUID());
            fail("Should've thrown PostDoesNotExistException");

        }catch(e){
            //Assert
            expect(e).toBeInstanceOf(PostDoesNotExistException);
        }
    })
})