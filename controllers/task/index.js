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
    const { taskId, characterIndex } = req.query;
    const file = req.file;

    if (!file) {
        return res.status(400).send({
            success: false,
            message: 'No file uploaded'
        });
    }

    if (!taskId) {
        return res.status(400).send({
            success: false,
            message: 'taskId is required'
        });
    }

    if (characterIndex === undefined) {
        return res.status(400).send({
            success: false,
            message: 'characterIndex is required'
        });
    }

    return uploadTaskImage(
        taskId,
        characterIndex,
        file.buffer,
        res
    );
};

const deleteImage = (req, res) => {
    const { taskId, characterIndex } = req.query;

    if (!characterIndex) {
        return res.status(400).send({ success: false, message: 'characterIndex query parameter is required' });
    }

    if (!taskId) {
        return res.status(400).send({ success: false, message: 'taskId query parameter is required' });
    }

    return deleteFromCloudinary(taskId, characterIndex, res);
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