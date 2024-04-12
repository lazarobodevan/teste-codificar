import CreateUserDTO from "../User/DTOs/CreateUserDTO";
import UserAlreadyExsitsException from "../User/exceptions/UserAlreadyExistsException";
import UserRepository from "../User/repositories/UserRepository";
import UserController from "../controllers/UserController";
import express from 'express';
import UserMiddleware from "../middlewares/UserMiddleware";

const userRepository = new UserRepository();
const userController = new UserController(userRepository);
const userMiddleware = new UserMiddleware();
export default(router:express.Router) =>{
    router.post("/users", userMiddleware.mapBodyToCreateUserDTO, userController.createUser);
    router.post("/users/login", userMiddleware.validateLoginBody, userController.login);
}