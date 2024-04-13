import axios from "axios";
import Environment from "../../config/Environment";
import Pagination from "../../models/Pagination";
import Post from "../../models/Post";

class PostService{

    static async getPosts(page:number, totalPages?:number){
        try{
            if(totalPages && page > totalPages-1) return;
            const response = await axios.get(`${Environment.getApiUrl()}/posts?page=${page}`);

            return {
                page: response.data.page,
                totalPages: response.data.totalPages,
                data: response.data.data
            }as Pagination<Post>;

        }catch(e:any){
            alert(e);
        }
    }
}

export default PostService;