import { Request } from "express";
import CreateUserDTO from "../DTOs/CreateUserDTO";

interface RequestWithUserData extends Request{
    createUserDTO?: CreateUserDTO;
}

export default RequestWithUserData;