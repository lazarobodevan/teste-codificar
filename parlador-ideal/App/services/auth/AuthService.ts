import axios from "axios";
import Environment from "../../config/Environment";

class AuthService{

    login = async(email:string, password:string) =>{
        try{
            const response = await axios.post(`${Environment.getApiUrl()}/users/login`, {email, password});

            if(response.status === 200){
                return response.data;
            }
        }catch(e){

        }
    }

}

export default AuthService;