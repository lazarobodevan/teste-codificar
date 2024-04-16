import { Post, User } from '@prisma/client';
import PostModelFactory from '../factories/Post/PostModelFactory'
import UserModelFactory from '../factories/User/UserModelFactory';
import PostController from '../../src/controllers/PostController';
import CreatePostUseCase from '../../src/Post/useCases/CreatePostUseCase';
import UpdatePostUseCase from '../../src/Post/useCases/UpdatePostUseCase';
import DeletePostUseCase from '../../src/Post/useCases/DeletePostUseCase';
import ListPostsUseCase from '../../src/Post/useCases/ListPostsUseCase';
import IPostRepository from '../../src/Post/repositories/IPostRepository';
import PostRepository from '../../src/Post/repositories/PostRepository';
import IUserRepository from '../../src/User/repositories/IUserRepository';
import UserRepository from '../../src/User/repositories/UserRepository';
import { Request, Response, query } from 'express';
import UserDoesNotExistException from '../../src/User/exceptions/UserDoesNotExistException';
import Consts from '../../src/shared/classes/consts';
import PostExceedsLimitOfContentLength from '../../src/Post/exceptions/PostExceedsLimitOfContentLength';
import PostCannotBeEmptyException from '../../src/Post/exceptions/PostCannotBeEmptyException';
import { randomUUID } from 'crypto';
import PostDoesNotExistException from '../../src/Post/exceptions/PostDoesNotExistException';
import UnauthorizedException from '../../src/shared/exceptions/UnauthorizedException';
import Pagination from '../../src/shared/classes/Pagination';

jest.mock('../../src/User/repositories/UserRepository', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    })),
  }));

jest.mock('../../src/Post/useCases/CreatePostUseCase', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        execute: jest.fn()
    })),
}));
jest.mock('../../src/Post/useCases/UpdatePostUseCase', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        execute: jest.fn()
    })),
}));
jest.mock('../../src/Post/useCases/DeletePostUseCase', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        execute: jest.fn()
    })),
}));
jest.mock('../../src/Post/useCases/ListPostsUseCase', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        execute: jest.fn()
    })),
}));

describe("PostController", ()=>{
    
    let user: User
    let post: Post;
    let postRepository: IPostRepository;
    let postController: PostController;
    let createPostUseCase: CreatePostUseCase;
    let updatePostUseCase: UpdatePostUseCase;
    let deletePostUseCase: DeletePostUseCase;
    let listPostsUseCase: ListPostsUseCase;
    let userRepository: IUserRepository;

    beforeEach(()=>{
        user = new UserModelFactory().build();
        post = new PostModelFactory().build();
        postRepository = new PostRepository();
        userRepository = new UserRepository();

        createPostUseCase = new CreatePostUseCase(postRepository, userRepository);
        updatePostUseCase = new UpdatePostUseCase(postRepository);
        deletePostUseCase = new DeletePostUseCase(postRepository);
        listPostsUseCase = new ListPostsUseCase(postRepository);

        postController = new PostController(
            createPostUseCase,
            updatePostUseCase,
            deletePostUseCase,
            listPostsUseCase
        );
    });

    describe('CreatePost', () => {
        it("Should create post successfully", async ()=>{
            
            //Arrange
            const postContent = "This is a test ";
            const expectedCreatedPost = new PostModelFactory().withContent(postContent).build();

            const req = <unknown>{
                user:user,
                body:{
                    content:postContent
                }
            } as Request;

            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;

            (createPostUseCase.execute as jest.Mock).mockResolvedValue(expectedCreatedPost);

            //Act
            await postController.createPost(req, res);

            //Assert

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expectedCreatedPost);
        });

        it("Should fail to create post for unknown reason", async ()=>{
            
            //Arrange
            const postContent = "This is a test ";
            const expectedCreatedPost = new PostModelFactory().withContent(postContent).build();
    
            const req = <unknown>{
                user:user,
                body:{
                    content:postContent
                }
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;
            
            const error = new Error("test");
    
            (createPostUseCase.execute as jest.Mock).mockRejectedValue(error);
    
            //Act
            await postController.createPost(req, res);
    
            //Assert
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: error.message});
        });
    
        it("Should fail to create post to not existent user", async ()=>{
                
            //Arrange
            const postContent = "This is a test ";
            const expectedCreatedPost = new PostModelFactory().withContent(postContent).build();
    
            const req = <unknown>{
                user:user,
                body:{
                    content:postContent
                }
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;
            
    
            (createPostUseCase.execute as jest.Mock).mockRejectedValue(new UserDoesNotExistException());
    
            //Act
            await postController.createPost(req, res);
    
            //Assert
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: new UserDoesNotExistException().message});
        })
    
        it(`Should fail to create post with more than ${Consts.POST_CONTENT_MAX_LENGTH} characters`, async ()=>{
                
            //Arrange
            let postContent = "";
    
            //Generating content with max length + 1
            for(let i = 0; i < Consts.POST_CONTENT_MAX_LENGTH + 1; i++){
                postContent += 'A';
            }
    
            const expectedCreatedPost = new PostModelFactory().withContent(postContent).build();
    
            const req = <unknown>{
                user:user,
                body:{
                    content:postContent
                }
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;
            
    
            (createPostUseCase.execute as jest.Mock).mockRejectedValue(new PostExceedsLimitOfContentLength());
    
            //Act
            await postController.createPost(req, res);
    
            //Assert
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: new PostExceedsLimitOfContentLength().message});
        });

        it(`Should fail to create empty post`, async ()=>{
                
            //Arrange
            let postContent = "           ";
    
    
            const expectedCreatedPost = new PostModelFactory().withContent(postContent).build();
    
            const req = <unknown>{
                user:user,
                body:{
                    content:postContent
                }
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;
            
    
            (createPostUseCase.execute as jest.Mock).mockRejectedValue(new PostCannotBeEmptyException());
    
            //Act
            await postController.createPost(req, res);
    
            //Assert
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: new PostCannotBeEmptyException().message});
        });
    });

    describe("UpdatePost", ()=>{
        it("Should update post successfully", async()=>{

            //Arrange
            const newContent = "New content";
            const expectedCreatedPost = new PostModelFactory().withContent(newContent).build();
    
            const req = <unknown>{
                params:[{id: expectedCreatedPost.id}],
                user:user,
                body:{
                    content:newContent
                },
                
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;

            (updatePostUseCase.execute as jest.Mock).mockResolvedValue(expectedCreatedPost);

            //Act
            await postController.updatePost(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedCreatedPost);
        });

        it("Should fail to update to empty post", async()=>{

            //Arrange
            const newContent = "      ";
            const expectedCreatedPost = new PostModelFactory().withContent(newContent).build();
    
            const req = <unknown>{
                params:[{id: expectedCreatedPost.id}],
                user:user,
                body:{
                    content:newContent
                },
                
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;

            (updatePostUseCase.execute as jest.Mock).mockRejectedValue(new PostCannotBeEmptyException());

            //Act
            await postController.updatePost(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: new PostCannotBeEmptyException().message});
        });

        it("Should fail to update a post that does not exist", async()=>{

            //Arrange
            const newContent = "      ";
            const expectedCreatedPost = new PostModelFactory().withContent(newContent).build();
    
            const req = <unknown>{
                params:[{id: randomUUID()}],
                user:user,
                body:{
                    content:newContent
                },
                
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;

            (updatePostUseCase.execute as jest.Mock).mockRejectedValue(new PostDoesNotExistException());

            //Act
            await postController.updatePost(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: new PostDoesNotExistException().message});
        });

        it("Should fail to update a post due to unknown error", async()=>{

            //Arrange
            const newContent = "      ";
            const expectedCreatedPost = new PostModelFactory().withContent(newContent).build();
    
            const req = <unknown>{
                params:[{id: randomUUID()}],
                user:user,
                body:{
                    content:newContent
                },
                
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;

            const error = new Error("test");

            (updatePostUseCase.execute as jest.Mock).mockRejectedValue(error);

            //Act
            await postController.updatePost(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: error.message});
        });
    });

    describe("DeletePost", ()=>{
        it("Should delete post successfully", async()=>{
            
            //Arrange
            const req = <unknown>{
                params:[{id: post.id}],
                user:user,                
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;

            (deletePostUseCase.execute as jest.Mock).mockResolvedValue(post);

            //Act
            await postController.deletePost(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(post);
        })
        
        it("Should fail to delete a post that does not exist", async()=>{
            
            //Arrange
            const req = <unknown>{
                params:[{id: randomUUID()}],
                user:user,                
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;

            (deletePostUseCase.execute as jest.Mock).mockRejectedValue(new PostDoesNotExistException());

            //Act
            await postController.deletePost(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: new PostDoesNotExistException().message});
        })

        it("Should fail to delete post from someone else", async()=>{
            
            //Arrange
            const req = <unknown>{
                params:[{id: randomUUID()}],
                user:user,                
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;

            (deletePostUseCase.execute as jest.Mock).mockRejectedValue(new UnauthorizedException());

            //Act
            await postController.deletePost(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({error: new UnauthorizedException().message});
        })

        it("Should fail to delete due to unknown error", async()=>{
            
            //Arrange
            const req = <unknown>{
                params:[{id: randomUUID()}],
                user:user,                
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;

            const error = new Error("test");

            (deletePostUseCase.execute as jest.Mock).mockRejectedValue(error);

            //Act
            await postController.deletePost(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: error.message});
        })
    });
    
    describe("ListPost", ()=>{
        it("Should list posts successfully", async()=>{

            //Arrange
            const factory = new PostModelFactory();

            //Length = 3
            const posts = [factory.build(), factory.build(), factory.build()]
            const expectedListedPosts = {
                page:0,
                totalPages:1,
                pageSize:8,
                offset:0,
                data: posts
            } as Pagination<Post>

            const req = <unknown>{
                query:{},
                user:user,                
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;

            (listPostsUseCase.execute as jest.Mock).mockResolvedValue(expectedListedPosts);
            
            //Act
            await postController.listPosts(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedListedPosts);
        })

        it("Should list posts successfully when page query is grater than the max o pages available", async()=>{

            //Arrange
            const factory = new PostModelFactory();

            //Length = 3
            const posts = [factory.build(), factory.build(), factory.build()]
            const expectedListedPosts = {
                page:0,
                totalPages:1,
                pageSize:8,
                offset:0,
                data: posts
            } as Pagination<Post>

            const req = <unknown>{
                query:{page:100},
                user:user,                
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;

            (listPostsUseCase.execute as jest.Mock).mockResolvedValue(expectedListedPosts);
            
            //Act
            await postController.listPosts(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedListedPosts);
        })

        it("Should fail to list posts due to unknown error", async()=>{

            //Arrange
            const factory = new PostModelFactory();

            const req = <unknown>{
                query:{},
                user:user,                
            } as Request;
    
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Response;
            const error = new Error("test");

            (listPostsUseCase.execute as jest.Mock).mockRejectedValue(error);
            
            //Act
            await postController.listPosts(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error:error.message});
        })
    })
    
});