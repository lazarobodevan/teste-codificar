import { PrismaClient } from "@prisma/client";
import { cliLogger, applicationLogger } from "../../utils/Logger";

class DatabaseContext{
    public connection!: PrismaClient;

    constructor(){
        try{
            this.connection = new PrismaClient();
            cliLogger.info("Connected to database");
        }catch(e){
            cliLogger.error("Failed to connect to the database", e);
            applicationLogger.error("Failed to connect to the database", e);
        }
    }
}

export default new DatabaseContext().connection;