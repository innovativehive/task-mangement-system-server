import {
    getAllTasks,
    addTask,
    updateSpecificTask,
    deleteSpecificTask,
} from "../../services/index.js";

const addNewTask = (req, res) => {
    const userObj = req.body;
    return addTask(userObj, res);
}

const getTasks = (req, res) => {
    const { status } = req.params
    return getAllTasks(status, res);
}

const updateTask = (req, res) => {
    const { id } = req.params;
    console.log("Updating Task with ID:", id);
    const updatedData = req.body;
    console.log("Updated Data:", updatedData);
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
    deleteTask
}