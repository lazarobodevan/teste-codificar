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
            throw e;
        }
    }

    static async createPost(content:string){
        try{
            const createdPost = await axios.post(`${Environment.getApiUrl()}/posts`, {content});
            return createdPost;
        }catch(e){
            throw e;
        }
    }

    static async updatePost(content:string, id:string){
        try{
            const updatedPost = await axios.put(`${Environment.getApiUrl()}/posts/${id}`,{content});
            return updatedPost;
        }catch(e){
            throw e;
        }
    }

    static async deletePost(id:string){
        try{
            const deletedPost = await axios.delete(`${Environment.getApiUrl()}/posts/${id}`);
            return deletedPost;
        }catch(e){
            throw e;
        }
    }
}

export default PostService;