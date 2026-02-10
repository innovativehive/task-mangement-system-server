import Task from "../../Model/Task.js";
import TaskSchema from "../../JoiModel/Task.js";

// Add a new Task
const addTask = async (userObj, res) => {
    const lastTask = await Task.findOne().sort({ fifoOrder: -1 });
    userObj.fifoOrder = lastTask ? lastTask.fifoOrder + 1 : 1;

    // Validate incoming request
    const { error } = TaskSchema.validate(userObj);
    if (error) {
        return res.status(400).send({ success: false, message: error.details[0].message });
    };

    try {
        // Create a new task
        const newTask = new Task({
            ...userObj,
        });
        await newTask.save(); // Save to the database

        return res.status(201).send({ success: true, message: 'Task added successfully', task: newTask });
    } catch (error) {
        console.error('Error adding designer:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

// Get all Tasks with optional pagination and status filter
const getAllTasks = async (page, size, status, res) => {
    console.log('page--->', page, 'size--->', size, 'status--->', status)
    try {
        let tasks;
        const totalTask = await Task.find({});
        if (page !== 'undefined' && size !== 'undefined') {
            const skip = (Number(page) - 1) * size;

            if (status === 'all') {
                tasks = await Task.find({}).sort({ name: 1 }).skip(skip).limit(size);
            } else {
                tasks = await Task.find({ status: status === 'show' ? true : false }).sort({ name: 1 }).skip(skip).limit(size);
            }
        } else {
            tasks = await Task.find({}).sort({ name: 1 });
        }

        return res.status(200).send({ sucess: true, tasks, totalTasks: totalTask.length })
    } catch (error) {
        console.log('error--->', error)
        res.status(500).send({ success: false, error, message: error.message })
    }
}

// Search Tasks with optional filters, pagination, and text query
const searchAllTasks = async (taskObj, res) => {
    try {
        const { name, status } = taskObj;
        let data;
        if (status) {
            data = await Task.find({ name: { $regex: new RegExp(name.toLowerCase(), 'i') }, status });
        } else {
            data = await Task.find({ name: { $regex: new RegExp(name.toLowerCase(), 'i') } });
        }
        return res.status(200).send({ sucess: true, data });
    } catch (error) {
        console.log('error--->', error);
        res.send({ success: false, error, message: error.message });
    }
}

// Update a specific Task
const updateSpecificTask = async (updatedData, id, res) => {

    try {
        const taskExist = await Task.findById(id);

        if (!taskExist) {
            return res.status(404).send({ success: false, message: 'Task not found' });
        }

        // Find the task by ID and update with only provided fields
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        // Respond with the updated task
        return res.status(200).send({ success: true, message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

const deleteSpecificTask = async (id, res) => {
    try {
        // Find the task by ID and delete
        const deletedTask = await Task.findByIdAndDelete(id);

        // If the task does not exist
        if (!deletedTask) {
            return res.status(404).send({ success: false, message: 'Task not found' });
        }

        // Return success response
        return res.status(200).send({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

export {
    getAllTasks,
    addTask,
    updateSpecificTask,
    deleteSpecificTask,
    searchAllTasks,
}