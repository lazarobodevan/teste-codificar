import { Prisma, User } from "@prisma/client";
import UserRepository from '../../../src/User/repositories/UserRepository';
import databaseContext from "../../../src/context/databaseContext";
import UserAlreadyExistsException from '../../../src/User/exceptions/UserAlreadyExistsException'
import UserModelFactory from "../../factories/User/UserModelFactory";

jest.mock('../../../src/context/databaseContext/index', () => ({
    __esModule: true,
    default: {
        user: {
            create: jest.fn(),
            findUnique: jest.fn()
        },
    },
}));

describe("#UserRepository", ()=>{
    describe("create",()=>{
        it("Should create a new user successfully and return User model", async() =>{

            //Arrange
            const mockUser = new UserModelFactory().build();
            (databaseContext.user.create as jest.Mock).mockResolvedValue(mockUser as User);
            const userRepository = new UserRepository();

            //Act
            const newUser = await userRepository.create(mockUser);

            //Assert
            expect(newUser).toEqual(mockUser);
        });

        it("Should throw UserAlreadyExistsException", async ()=>{

            //Arrange
            const mockUser = new UserModelFactory().build();
            (databaseContext.user.create as jest.Mock).mockRejectedValue(new Prisma.PrismaClientKnownRequestError('P2002', {code:"P2002",clientVersion:"2"}));
            const userRepository = new UserRepository();
            
            try {
                //Act
                await userRepository.create(mockUser);
                fail('create method should throw UserAlreadyExistsException');
            } catch (error) {
                //Assert
                expect(error).toBeInstanceOf(UserAlreadyExistsException);
            }
        });

        it("Should throw any error", async()=>{

            //Arrange
            const mockUser = new UserModelFactory().build();
            (databaseContext.user.create as jest.Mock).mockRejectedValue(Error());
            const userRepository = new UserRepository();

            try {
                //Act
                await userRepository.create(mockUser);
                fail('create method should throw UserAlreadyExistsException');
            } catch (error) {
                //Assert
                expect(error).toBeInstanceOf(Error);
            }
        })
    });

    describe("Find by email", () =>{
        it("Should find by email and return User model", async()=>{
            
            //Arrange
            const mockUser = new UserModelFactory().build();
            (databaseContext.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
            const userRepository = new UserRepository();

            //Act
            const foundUser = await userRepository.findByEmail("");

            //Assert
            expect(foundUser).toEqual(mockUser);
        });

        it("Should not find by email and return null", async()=>{
            
            //Arrange
            (databaseContext.user.findUnique as jest.Mock).mockResolvedValue(null);
            const userRepository = new UserRepository();

            //Act
            const foundUser = await userRepository.findByEmail("");

            //Assert
            expect(foundUser).toBeNull();
        });

        it("Should not find by email and return null", async()=>{
            
            //Arrange
            (databaseContext.user.findUnique as jest.Mock).mockRejectedValue(new Error());
            const userRepository = new UserRepository();

            //Act
            try{
                const foundUser = await userRepository.findByEmail("");
                fail("Should've thrown Error");
            }catch(e){
                expect(e).toBeInstanceOf(Error);
            }
        })
    })
    
})