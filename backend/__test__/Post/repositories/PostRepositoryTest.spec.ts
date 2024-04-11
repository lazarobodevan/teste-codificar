import databaseContext from "../../../src/context/databaseContext";
import { Post } from "@prisma/client";
import UserModelFactory from "../../factories/User/UserModelFactory";
import PostModelFactory from "../../factories/Post/PostModelFactory";
import PostRepository from '../../../src/Post/repositories/PostRepository'
import PostDoesNotExistException from "../../../src/Post/exceptions/PostDoesNotExistException";
import { randomUUID } from "crypto";
import Pagination from "../../../src/shared/classes/Pagination";

jest.mock('../../../src/context/databaseContext/index', () => ({
    __esModule: true,
    default: {
        post: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn()
        },
    },
}));

describe("#PostRepository", ()=>{
    describe("Create", () =>{
        it("Should create a new post", async() =>{
            //Arrange
            const user = new UserModelFactory().build();
            const expectedPost = new PostModelFactory().withAuthorId(user.id).build();
            const postRepository = new PostRepository();

            (databaseContext.post.create as jest.Mock).mockResolvedValue(expectedPost);

            //Act
            const createdPost = await postRepository.create(expectedPost);

            //Assert
            expect(createdPost).toEqual(expectedPost);
        });

        it("Should fail to create a new post and throw Exception", async() =>{
            //Arrange
            const user = new UserModelFactory().build();
            const expectedPost = new PostModelFactory().withAuthorId(user.id).build();
            const postRepository = new PostRepository();

            (databaseContext.post.create as jest.Mock).mockRejectedValue(new Error());

            try{
                //Act
                const createdPost = await postRepository.create(expectedPost);
                fail("Should've thrown error")
            }catch(e){

                //Assert
                expect(e).toBeInstanceOf(Error);
            }
            
        });
    });

    describe("Update", () =>{
        it("Should update existent Post and return Post model", async()=>{
            //Arrange
            const post = new PostModelFactory().build();
            const postRepository = new PostRepository();
            const newContent = "This is a test where we have less than 280 chars.";
            const expectedUpdatedPost = new PostModelFactory()
                .withAuthorId(post.authorId)
                .withId(post.id)
                .withContent(newContent)
                .withUpdatedAt(new Date())
                .withCreatedAt(post.createdAt)
                .build();

            (databaseContext.post.findUnique as jest.Mock).mockResolvedValue(post);
            (databaseContext.post.update as jest.Mock).mockResolvedValue(expectedUpdatedPost);

            //Act
            const updatedPost = await postRepository.update(newContent, post.id);

            //Assert
            expect(updatedPost).toEqual(expectedUpdatedPost);
            expect(updatedPost.content).not.toEqual(post.content);
            expect(updatedPost.updatedAt).not.toEqual(post.updatedAt)
            expect(updatedPost.authorId).toEqual(post.authorId);
            expect(updatedPost.createdAt).toEqual(post.createdAt);
            expect(updatedPost.id).toEqual(post.id);
        });

        it("Should fail to update unexistent Post and throw PostDoesNotExistsException", async()=>{
            //Arrange
            const post = new PostModelFactory().build();
            const postRepository = new PostRepository();
            const newContent = "This is a test where we have less than 280 chars.";
            const expectedUpdatedPost = new PostModelFactory()
                .withAuthorId(post.authorId)
                .withId(post.id)
                .withContent(newContent)
                .withUpdatedAt(new Date())
                .build();

            (databaseContext.post.findUnique as jest.Mock).mockResolvedValue(null);
            (databaseContext.post.update as jest.Mock).mockResolvedValue(expectedUpdatedPost);

            try{
                const updatedPost = await postRepository.update(newContent, post.id);
                fail("Should've thrown PostDoesNotExistException")
            }catch(e){
                expect(e).toBeInstanceOf(PostDoesNotExistException);
            }
        });

        // it("Should fail to update to more than 280 characters", async()=>{
        //     //Arrange
        //     const post = new PostModelFactory().build();
        //     const postRepository = new PostRepository();
        //     const newContent = "This is a test where we have more than 280 chars. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in lacus vulputate, suscipit sapien quis, dignissim neque. Sed vel euismod lacus, ut sagittis quam. Sed et ante justo. Ut sollicitudin non arcu ut pharetra. Nullam varius ligula enim, id tincidunt justo rutrum p";
        //     const expectedUpdatedPost = new PostModelFactory()
        //         .withAuthorId(post.authorId)
        //         .withId(post.id)
        //         .withContent(newContent)
        //         .withUpdatedAt(new Date())
        //         .build();

        //     (databaseContext.post.findUnique as jest.Mock).mockResolvedValue(post);
        //     (databaseContext.post.update as jest.Mock).mockResolvedValue(expectedUpdatedPost);

        //     try{
        //         const updatedPost = await postRepository.update(newContent, post.id);
        //         fail("Should've thrown PostDoesNotExistException");
        //     }catch(e){
        //         expect(e).toBeInstanceOf(PostDoesNotExistException);
        //     }
        // })
    });

    describe("Delete",() =>{
        it("Should delete post successfully", async ()=>{
            
            //Arrange
            const post = new PostModelFactory().build();
            const postRepository = new PostRepository();

            (databaseContext.post.findUnique as jest.Mock).mockResolvedValue(post);
            (databaseContext.post.delete as jest.Mock).mockResolvedValue(post);

            //Act
            const deletedPost = await postRepository.delete(post.id);

            //Assert
            expect(deletedPost).toEqual(post);

        });

        it("Should fail to delete unexistent post", async () =>{

            //Arrange
            const randomId = randomUUID();
            const postRepository = new PostRepository();

            (databaseContext.post.findUnique as jest.Mock).mockResolvedValue(null);
            
            try{
                //Act
                const deletedPost = await postRepository.delete(randomId);
                fail("Should've thrown PostDoesNotExistException");

            }catch(e){
                //Assert
                expect(e).toBeInstanceOf(PostDoesNotExistException);
            }
            
        });
    });

    describe("List", ()=>{
        it("Should return a paginated list of recent posts", async()=>{

            //Arrange
            const pageSize = 10;
            const mockPosts = Array.from({ length: pageSize }, (_, index) => (new PostModelFactory().build()));
            const paginatedPosts = new Pagination<Post>({
                page:1,
                offset:0,
                pageSize:10,
                data:mockPosts
            })
            const postRepository = new PostRepository();

            (databaseContext.post.findMany as jest.Mock).mockResolvedValue(mockPosts);
            const page = 1;

            //Act
            const result = await postRepository.list(page, pageSize);

            //Assert
            expect(result.data.map(post => ({ ...post, createdAt: post.createdAt.toISOString() })))
                .toEqual(paginatedPosts.data.map(post => ({ ...post, createdAt: post.createdAt.toISOString() })));

            expect(databaseContext.post.findMany).toHaveBeenCalledWith({
                skip: 0,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include:{author:true}
            });
        });
    })
})