import express from 'express';
import PostRepository from '../Post/repositories/PostRepository';
import UserRepository from '../User/repositories/UserRepository';
import PostController from '../controllers/PostController';
import PostMiddleware from '../middlewares/PostMiddleware';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const postRepository = new PostRepository();
const userRepository = new UserRepository();
const postController = new PostController(postRepository, userRepository);
const postMiddleware = new PostMiddleware();

export default(router:express.Router) =>{
    router.use(authMiddleware);
    router.post("/posts", postMiddleware.validateContent, postController.createPost);
    router.put("/posts/:id", postMiddleware.validateContent, postController.updatePost);
    router.delete("/posts/:id", postController.deletePost);
    router.get("/posts", postController.listPosts);
}