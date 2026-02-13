import Task from "../../Model/Task.js";
import TaskSchema from "../../JoiModel/Task.js";
import cloudinary from "../../config/cloudinary.js";

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
const getAllTasks = async (page, size, status, designer, res) => {
    try {
        console.log('Received getAllTasks request with page:', page, 'size:', size, 'status:', status, 'designer:', designer);
        let tasks;
        const totalTask = await Task.find({});
        if (page !== 'undefined' && size !== 'undefined') {
            const skip = (Number(page) - 1) * size;

            if (status === 'all') {
                tasks = await Task.find({ assignedTo: designer }).sort({ createdAt: 1 }).skip(skip).limit(size);
            } else {
                tasks = await Task.find({ status, assignedTo: designer }).sort({ createdAt: 1 }).skip(skip).limit(size);
            }
        } else {
            tasks = await Task.find({ assignedTo: designer }).sort({ createdAt: 1 });
        }

        console.log('tasks--->', tasks)

        return res.status(200).send({ success: true, tasks, totalTasks: totalTask.length })
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
        // Find the task by ID
        const task = await Task.findById(id);

        // If the task does not exist
        if (!task) {
            return res.status(404).send({ success: false, message: 'Task not found' });
        }

        // Collect public IDs from referenceImage and approvalWork arrays
        const publicIds = [];
        if (Array.isArray(task.referenceImage)) {
            publicIds.push(...task.referenceImage.map(f => f.publicId || f.public_id).filter(Boolean));
        }
        if (Array.isArray(task.approvalWork)) {
            publicIds.push(...task.approvalWork.map(f => f.publicId || f.public_id).filter(Boolean));
        }

        // Delete resources from Cloudinary if any
        if (publicIds.length > 0) {
            try {
                await cloudinary.api.delete_resources(publicIds, { resource_type: 'image', invalidate: true });
            } catch (cloudErr) {
                console.error('Error deleting images from Cloudinary:', cloudErr);
                // Continue to delete the task record even if Cloudinary deletion fails
            }
        }

        // Delete the task document
        await Task.findByIdAndDelete(id);

        // Return success response
        return res.status(200).send({ success: true, message: 'Task and associated images deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

// Upload images for a task
const uploadTaskImage = async (taskId, fileBuffers, fileType, res) => {
    try {
        // Check if task exists
        const taskExist = await Task.findById(taskId);
        if (!taskExist) {
            return res.status(404).send({ success: false, message: 'Task not found' });
        }

        // Check if file buffers exist
        if (!fileBuffers || fileBuffers.length === 0) {
            return res.status(400).send({ success: false, message: 'No image files provided' });
        }

        // Validate fileType parameter
        if (!fileType || !['referenceImage', 'approvalWork'].includes(fileType)) {
            return res.status(400).send({ success: false, message: 'Invalid fileType parameter. Use referenceImage or approvalWork' });
        }

        const folder = fileType === 'referenceImage' ? 'task-management/reference-images' : 'task-management/approval-work';
        const uploadedFiles = [];
        let uploadCount = 0;

        // Process each file
        fileBuffers.forEach((fileBuffer) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'auto',
                    public_id: `${fileType}-${taskId}-${Date.now()}-${uploadCount}`,
                },
                async (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return res.status(500).send({ success: false, message: 'Failed to upload image', error: error.message });
                    }

                    // Store file details
                    const fileDetails = {
                        url: result.secure_url,
                        publicId: result.public_id,
                    };

                    uploadedFiles.push(fileDetails);

                    // Check if all files are uploaded
                    if (uploadedFiles.length === fileBuffers.length) {
                        try {
                            // Update task with the uploaded files
                            const updatedTask = await Task.findByIdAndUpdate(
                                taskId,
                                { $push: { [fileType]: { $each: uploadedFiles } } },
                                { new: true }
                            );

                            return res.status(200).send({
                                success: true,
                                message: `Files uploaded and saved to ${fileType} successfully`,
                                task: updatedTask,
                                uploadedFiles: uploadedFiles
                            });
                        } catch (dbError) {
                            console.error('Error updating task with files:', dbError);
                            return res.status(500).send({ success: false, message: 'Failed to save files to database' });
                        }
                    }
                }
            );

            uploadStream.end(fileBuffer);
            uploadCount++;
        });
    } catch (error) {
        console.error('Error uploading images:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: error.message });
    }
}

const deleteFromCloudinary = async (taskId, fileType, publicId, res) => {
    try {
        const decodedPublicId = decodeURIComponent(publicId);
        // Check for existing image and delete it if present
        await cloudinary.api.delete_resources([decodedPublicId], { resource_type: 'image' }, async (deleteError, deleteResult) => {
            if (deleteError && deleteError.http_code !== 404) { // If error is not 'not found'
                console.error("Cloudinary delete error:", deleteError);
                return res.status(500).send({ success: false, error: deleteError });
            }
        });


        // Then, remove the image reference from the Task document (if it exists)
        const task = await Task.findOneAndUpdate(
            { _id: taskId },
            { $pull: { [fileType]: { publicId: decodedPublicId } } }, // Remove the image with the specific decodedPublicId
            { new: true }
        );

        if (!task) {
            return res.status(404).send({ success: false, message: 'Task not found' });
        }

        return res.status(200).send({ success: true, message: 'Image deleted and Task updated' });

    } catch (error) {
        console.log("error", error);
        res.status(500).send({ success: false, error: error?.message });
    }
};

export {
    getAllTasks,
    addTask,
    updateSpecificTask,
    deleteSpecificTask,
    searchAllTasks,
    uploadTaskImage,
    deleteFromCloudinary,
}