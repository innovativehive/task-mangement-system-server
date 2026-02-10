import express from "express";
import {
    getTasks,
    addNewTask,
    updateTask,
    deleteTask
    , searchTasks
} from "../controllers/task/index.js"

const Route = express.Router();

Route.get("/all/:page/:size/:status", getTasks);
Route.post("/search", searchTasks);
Route.post('/add', addNewTask);
Route.put('/update/:id', updateTask);
Route.delete('/delete/:id', deleteTask);



export default Route;