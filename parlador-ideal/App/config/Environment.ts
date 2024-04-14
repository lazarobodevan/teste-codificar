import {DEV_API_BASE_URL, PRD_API_BASE_URL} from '@env';
class Environment{
    static getApiUrl(){
        if(__DEV__){
            return DEV_API_BASE_URL;
        }
        return PRD_API_BASE_URL;
    }

}

export default Environment;