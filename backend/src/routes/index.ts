import express from 'express';
import UserRoutes from './UserRoutes';
import PostRoutes from './PostRoutes';

const router = express.Router();

export default():express.Router =>{
    UserRoutes(router);
    PostRoutes(router);
    return router;
}