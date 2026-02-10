import {
    getAllTasks,
    addTask,
    updateSpecificTask,
    deleteSpecificTask,
    searchAllTasks,
} from "../../services/index.js";

const addNewTask = (req, res) => {
    const userObj = req.body;
    return addTask(userObj, res);
}

const getTasks = async (req, res) => {
    const { page, size, status } = req.params;
    return getAllTasks(page, size, status, res)
}

const searchTasks = async (req, res) => {
    const taskObj = req.body;
    return searchAllTasks(taskObj, res)
}

const updateTask = (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    return updateSpecificTask(updatedData, id, res);
}

const deleteTask = (req, res) => {
    const { id } = req.params;
    return deleteSpecificTask(id, res);
}

export {
    getTasks,
    addNewTask,
    updateTask,
    deleteTask,
    searchTasks
}