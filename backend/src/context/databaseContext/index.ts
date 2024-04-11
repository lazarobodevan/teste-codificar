import { PrismaClient } from "@prisma/client";

class DatabaseContext{
    public connection!: PrismaClient;

    constructor(){
        try{
            this.connection = new PrismaClient();
        }catch(e){
            console.log(e)
        }
    }
}

export default new DatabaseContext().connection;