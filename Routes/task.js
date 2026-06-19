import express from "express";
import {
    getTasks,
    addNewTask,
    updateTask,
    deleteTask,
    searchTasks,
    uploadImage,
    deleteImage,
} from "../controllers/task/index.js"
import upload from "../middleware/fileUpload.js";

const Route = express.Router();

Route.get("/all/:page/:size/:status/:designer", getTasks);
Route.post("/search", searchTasks);
Route.post('/add', addNewTask);
Route.put('/update/:id', updateTask);
Route.delete('/delete/:id', deleteTask);
Route.post('/upload', upload.single('file'), uploadImage);
// Route.post('/upload', upload.array('files'), uploadImage);
Route.delete('/delete-image', deleteImage);

export default Route;