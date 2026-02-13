import {
    getAllTasks,
    addTask,
    updateSpecificTask,
    deleteSpecificTask,
    searchAllTasks,
    uploadTaskImage,
    deleteFromCloudinary,
} from "../../services/index.js";

const addNewTask = (req, res) => {
    const userObj = req.body;
    return addTask(userObj, res);
}

const getTasks = async (req, res) => {
    const { page, size, status, designer } = req.params;
    return getAllTasks(page, size, status, designer, res)
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

const uploadImage = (req, res) => {
    const { taskId, fileType } = req.query;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).send({ success: false, message: 'No files uploaded' });
    }

    if (!taskId) {
        return res.status(400).send({ success: false, message: 'taskId query parameter is required' });
    }

    if (!fileType) {
        return res.status(400).send({ success: false, message: 'fileType query parameter is required (referenceImage or approvalWork)' });
    }

    const fileBuffers = files.map(file => file.buffer);
    return uploadTaskImage(taskId, fileBuffers, fileType, res);
}

const deleteImage = (req, res) => {
    const { taskId, fileType, publicId } = req.query;

    if (!publicId) {
        return res.status(400).send({ success: false, message: 'publicId query parameter is required' });
    }

    if (!taskId) {
        return res.status(400).send({ success: false, message: 'taskId query parameter is required' });
    }

    if (!fileType) {
        return res.status(400).send({ success: false, message: 'fileType query parameter is required (referenceImage or approvalWork)' });
    }

    return deleteFromCloudinary(taskId, fileType, publicId, res);
}

export {
    getTasks,
    addNewTask,
    updateTask,
    deleteTask,
    searchTasks,
    uploadImage,
    deleteImage,
}