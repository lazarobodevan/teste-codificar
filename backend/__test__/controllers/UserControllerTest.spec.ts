import { randomUUID } from 'crypto';
import CreateUserDTO from '../../src/User/DTOs/CreateUserDTO';
import ListUserDTO from '../../src/User/DTOs/ListUserDTO';
import UserRepository from '../../src/User/repositories/UserRepository';
import CreateUserUseCase from '../../src/User/useCases/CreateUserUseCase';
import UserController from '../../src/controllers/UserController'
import { User } from '@prisma/client';
import UserModelFactory from '../factories/User/UserModelFactory';
import RequestWithUserData from '../../src/User/interfaces/RequestWithUserData';
import { Request, Response } from 'express';
import LoginUseCase from '../../src/User/useCases/LoginUseCase';
import UserAlreadyExsitsException from '../../src/User/exceptions/UserAlreadyExistsException';
import UserLoginDTO from '../../src/User/DTOs/UserLoginDTO';
import InvalidCredentialsException from '../../src/shared/exceptions/InvalidCredentialsException';

jest.mock('../../src/User/repositories/UserRepository', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    })),
  }));

jest.mock('../../src/User/useCases/CreateUserUseCase', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        execute: jest.fn()
    })),
}));

jest.mock('../../src/User/useCases/LoginUseCase', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        execute: jest.fn()
    })),
}));

describe("UserController", ()=>{
    let userRepository:UserRepository;
    let expectedCreatedUser:User;
    let userController:UserController;
    let createUserUseCase:CreateUserUseCase;
    let loginUseCase:LoginUseCase;
    let userId:string;

    beforeEach(()=>{
        userRepository = new UserRepository();
        createUserUseCase = new CreateUserUseCase(userRepository);
        loginUseCase = new LoginUseCase(userRepository);
        userController = new UserController(createUserUseCase,loginUseCase);
        userId = randomUUID();
        expectedCreatedUser = new UserModelFactory()
                .withId(userId)
                .withEmail("test@test.com")
                .withPassword("123")
                .build();
    });

    describe("CreateUser", ()=>{
        it("Should create user successfully", async ()=>{

            //Arrange
            const createUserDTO = {
                name: expectedCreatedUser.name,
                email:"test@test.com",
                password:"123"
            } as CreateUserDTO;

            const listUserDTO = {
                id: userId,
                name: createUserDTO.name,
                email: createUserDTO.email
            }as ListUserDTO;

            const req = {createUserDTO} as RequestWithUserData;;
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }as Response;

            (createUserUseCase.execute as jest.Mock).mockResolvedValue(listUserDTO);

            //Act
            await userController.createUser(req, res);

            //Assert
            expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDTO);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(listUserDTO)

        });

        it("Should fail to create user that already exists", async ()=>{
            //Arrange
            const createUserDTO = {
                name: expectedCreatedUser.name,
                email:"test@test.com",
                password:"123"
            } as CreateUserDTO;

            const req = {createUserDTO} as RequestWithUserData;;
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }as Response;

            (createUserUseCase.execute as jest.Mock).mockRejectedValue(new UserAlreadyExsitsException());
           
            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: new UserAlreadyExsitsException().message})
        });


        it("Should throw unknown error", async ()=>{
            //Arrange
            const createUserDTO = {
                name: expectedCreatedUser.name,
                email:"test@test.com",
                password:"123"
            } as CreateUserDTO;

            const req = {createUserDTO} as RequestWithUserData;;
            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }as Response;
            const error = new Error("test");

            (createUserUseCase.execute as jest.Mock).mockRejectedValue(error);
           
            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: error.message})
        });
    });

    describe('Login', () => {
        it("Should login successfully", async () =>{
            
            //Arrange
            const user = new UserModelFactory().build();
            const req = {body:{
                email:user.email, 
                password: user.password
            }} as Request;

            const res = <unknown>{
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }as Response;

            const expectedUserLoginDTO = {
                user:user,
                token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            }as UserLoginDTO;

            (loginUseCase.execute as jest.Mock).mockResolvedValue(expectedUserLoginDTO);

            //Act
            await userController.login(req, res);

            //Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedUserLoginDTO);
        })
    });

    it("Should fail to login and throw InvalidCredentialsException", async()=>{

        //Arrange
        const user = new UserModelFactory().build();
        const req = {body:{
            email:user.email, 
            password: user.password
        }} as Request;

        const res = <unknown>{
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }as Response;

        (loginUseCase.execute as jest.Mock).mockRejectedValue(new InvalidCredentialsException());

        //Act
        await userController.login(req, res);

        //Assert
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({error: new InvalidCredentialsException().message});
    });

    it("Should fail to login and throw any error", async()=>{

        //Arrange
        const user = new UserModelFactory().build();
        const req = {body:{
            email:user.email, 
            password: user.password
        }} as Request;

        const res = <unknown>{
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }as Response;

        const error = new Error("test");

        (loginUseCase.execute as jest.Mock).mockRejectedValue(error);

        //Act
        await userController.login(req, res);

        //Assert
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({error: error.message});
    });
})