import express from "express";
import {
    getTasks,
    addNewTask,
    updateTask,
    deleteTask
} from "../controllers/task/index.js"

const Route = express.Router();

Route.get('/get/:status', getTasks);
Route.post('/add', addNewTask);
Route.put('/update/:id', updateTask);
Route.delete('/delete/:id', deleteTask);



export default Route;