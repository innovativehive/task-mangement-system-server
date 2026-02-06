import express from "express";
import auth from "./auth.js";
import team from "./team.js";
import verifyToken from "../middleware/jwtToken.js";
import desginer from "./designer.js"
import task from "./task.js"


const Route = express.Router();

Route.use('/auth', auth);
Route.use('/team', verifyToken, team);
Route.use('/designer', verifyToken, desginer);
Route.use('/task', verifyToken, task);

export default Route;