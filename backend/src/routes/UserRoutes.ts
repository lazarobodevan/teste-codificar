import CreateUserDTO from "../User/DTOs/CreateUserDTO";
import UserAlreadyExsitsException from "../User/exceptions/UserAlreadyExistsException";
import UserRepository from "../User/repositories/UserRepository";
import UserController from "../controllers/UserController";
import express from 'express';
import UserMiddleware from "../middlewares/UserMiddleware";
import CreateUserUseCase from "../User/useCases/CreateUserUseCase";
import LoginUseCase from "../User/useCases/LoginUseCase";

const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository);
const userController = new UserController(createUserUseCase, loginUseCase);
const userMiddleware = new UserMiddleware();

export default(router:express.Router) =>{
    router.post("/users", userMiddleware.mapBodyToCreateUserDTO, userController.createUser);
    router.post("/users/login", userMiddleware.validateLoginBody, userController.login);
}