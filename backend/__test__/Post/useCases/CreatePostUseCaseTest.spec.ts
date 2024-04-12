import PostRepository from "../../../src/Post/repositories/PostRepository";
import CreatePostUseCase from '../../../src/Post/useCases/CreatePostUseCase';
import { randomUUID } from "crypto";
import PostModelFactory from "../../factories/Post/PostModelFactory";
import UserRepository from "../../../src/User/repositories/UserRepository";
import UserModelFactory from "../../factories/User/UserModelFactory";
import UserDoesNotExistException from "../../../src/User/exceptions/UserDoesNotExistException";
import PostExceedsLimitOfContentLength from "../../../src/Post/exceptions/PostExceedsLimitOfContentLength";
import CreatePostDTO from "../../../src/Post/DTOs/CreatePostDTO";

jest.mock('../../../src/Post/repositories/PostRepository', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        list:   jest.fn()
    })),
}));

jest.mock('../../../src/User/repositories/UserRepository', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    })),
  }));

describe("CreatePostUseCase",()=>{
    it("Should create post successfully", async()=>{
        //Arrange

        const user = new UserModelFactory().build();
        const postDTO = {
            authorId: user.id,
            content: "test"
        } as CreatePostDTO;
        
        
        const expectedCreatedPost = new PostModelFactory()
            .withAuthorId(postDTO.authorId)
            .withContent(postDTO.content)
            .build();

        const postRepository = new PostRepository();
        const userRepository = new UserRepository();
        
        (postRepository.create as jest.Mock).mockResolvedValue(expectedCreatedPost);
        (userRepository.findById as jest.Mock).mockResolvedValue(user);

        const createPostUseCase = new CreatePostUseCase(postRepository, userRepository);

        //Act
        const createdPost = await createPostUseCase.execute(postDTO);

        //Assert
        expect(createdPost).toEqual(expectedCreatedPost);
    });

    it("Should fail to create a post to a not existent user and return UserDoesNotExistException", async()=>{
        //Arrange
        const postDTO = {
            authorId: randomUUID(),
            content: "test"
        } as CreatePostDTO;

        const postRepository = new PostRepository();
        const userRepository = new UserRepository();
        
        (userRepository.findById as jest.Mock).mockResolvedValue(null);

        const createPostUseCase = new CreatePostUseCase(postRepository, userRepository);

        try{
            //Act
            const createdPost = await createPostUseCase.execute(postDTO);
            fail("Should've thrown UserDoesNotExistException");

        }catch(e){
            //Assert
            expect(e).toBeInstanceOf(UserDoesNotExistException);
        }
    });

    it("Should fail to create a post with content length greater than the max stablished and throw PostExceedsLimitOfContentLength", async() =>{
        
        //Arrange
        const MAX_CONTENT_LENGTH = 280;
        let content = ""

        //Generating content with max length + 1
        for(let i = 0; i < MAX_CONTENT_LENGTH+1; i++){
            content+="A";
        }

        const user = new UserModelFactory().build();
        const postDTO = {
            authorId: user.id,
            content: content
        }as CreatePostDTO;

        const userRepository = new UserRepository();
        const postRepository = new PostRepository();
        const createPostUseCase = new CreatePostUseCase(postRepository, userRepository);

        (userRepository.findById as jest.Mock).mockResolvedValue(user);
        
        try{
            //Act
            const createdPost = await createPostUseCase.execute(postDTO);
            fail("Should've thrown PostExceedsLimitOfContentLength");
        }catch(e){
            expect(e).toBeInstanceOf(PostExceedsLimitOfContentLength);
        }
        //Assert
    })
})