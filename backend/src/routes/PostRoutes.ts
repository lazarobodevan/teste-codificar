import express from 'express';
import PostRepository from '../Post/repositories/PostRepository';
import UserRepository from '../User/repositories/UserRepository';
import PostController from '../controllers/PostController';
import PostMiddleware from '../middlewares/PostMiddleware';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import CreatePostUseCase from '../Post/useCases/CreatePostUseCase';
import UpdatePostUseCase from '../Post/useCases/UpdatePostUseCase';
import DeletePostUseCase from '../Post/useCases/DeletePostUseCase';
import ListPostsUseCase from '../Post/useCases/ListPostsUseCase';

const postRepository = new PostRepository();
const userRepository = new UserRepository();

const createPostUseCase = new CreatePostUseCase(postRepository, userRepository);
const updatePostUseCase = new UpdatePostUseCase(postRepository);
const deletePostUseCase = new DeletePostUseCase(postRepository);
const listPostsUseCase = new ListPostsUseCase(postRepository);

const postController = new PostController(
    createPostUseCase,
    updatePostUseCase,
    deletePostUseCase,
    listPostsUseCase
);
const postMiddleware = new PostMiddleware();

export default(router:express.Router) =>{
    router.use(authMiddleware);
    router.post("/posts", postMiddleware.validateContent, postController.createPost);
    router.put("/posts/:id", postMiddleware.validateContent, postController.updatePost);
    router.delete("/posts/:id", postController.deletePost);
    router.get("/posts", postController.listPosts);
}