import express from "express";
import {
    createNewUser,
    authenticateUser,
    changePassword,
} from "../controllers/auth/index.js";

const Route = express.Router();

Route.post('/create', createNewUser);
Route.post('/', authenticateUser);
Route.get('/password/:name/:oldPass/:newPass', changePassword);

export default Route;