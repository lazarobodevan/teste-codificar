import { Prisma, User } from "@prisma/client";
import UserRepository from '../../../src/User/repositories/UserRepository';
import UserAlreadyExistsException from '../../../src/User/exceptions/UserAlreadyExistsException'
import CreateUserUseCase from '../../../src/User/useCases/CreateUserUseCase'
import UserModelFactory from "../../factories/User/UserModelFactory";
import CreateUserDTO from "../../../src/User/DTOs/CreateUserDTO";

jest.mock('../../../src/User/repositories/UserRepository', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    })),
  }));
  

describe("CreateUserUseCase", ()=>{
    it("Should create new user and return ListUser object", async()=>{
        //Arrange
        const expectedUser = new UserModelFactory().build();
        const userDTO = {
            email: expectedUser.email,
            name: expectedUser.name,
            password: expectedUser.password
        }as CreateUserDTO;

        let userRepository = new UserRepository();
        (userRepository.create as jest.Mock).mockResolvedValue(expectedUser);
        (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

        const createUserUseCase = new CreateUserUseCase(userRepository);

        //Act
        const createdUser = await createUserUseCase.execute(userDTO);

        //Assert
        expect(createdUser.id).toEqual(expectedUser.id);
        expect(createdUser.name).toEqual(expectedUser.name);
        expect(createdUser.email).toEqual(expectedUser.email);
        expect(createdUser).not.toHaveProperty("password");
    });

    it("Should throw UserAlreadyExistsException", async()=>{
        //Arrange
        const foundUser = new UserModelFactory().build();
        const userDTO = {
            email: foundUser.email,
            name: foundUser.name,
            password: foundUser.password
        }as CreateUserDTO;

        let userRepository = new UserRepository();
        (userRepository.findByEmail as jest.Mock).mockResolvedValue(foundUser);
        const createUserUseCase = new CreateUserUseCase(userRepository);

        //Act
        try{
            const createdUser = await createUserUseCase.execute(userDTO);
            fail("Should've thrown UserAlreadyExistsException");
        }catch(e){
            expect(e).toBeInstanceOf(UserAlreadyExistsException);
        }
    });
})
