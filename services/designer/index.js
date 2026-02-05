import Designer from "../../Model/Designer.js";
import DesignerSchema from "../../JoiModel/Designer.js";

// Add a new Designer
const addDesigner = async (userObj, res) => {
    // Validate incoming request
    const { error } = DesignerSchema.validate(userObj);
    if (error) {
        return res.status(400).send({ success: false, message: error.details[0].message });
    };

    try {
        const { name } = userObj;

        // Check if designer already exists by name
        const existingDesigner = await Designer.findOne({ name });
        if (existingDesigner) {
            return res.status(409).send({ success: false, message: 'Designer already exists with this name' });
        }

        // Create a new designer
        const newDesigner = new Designer({
            ...userObj,
        });
        await newDesigner.save(); // Save to the database

        return res.status(201).send({ success: true, message: 'Designer added successfully', designer: newDesigner });
    } catch (error) {
        console.error('Error adding designer:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

// Get all Designers
const getAllDesigners = async (team, res) => {
    try {
        // Fetch all salesmen from the database
        const designers =
            team === 'all' ?
                await Designer.find({}).sort({ team: 1, name: 1 }) :
                await Designer.find({ team }).sort({ team: 1, name: 1 });

        // Send response with designers
        return res.status(200).send({ success: true, designers });
    } catch (error) {
        console.error('Error fetching designers:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

// Update a specific Designer
const updateSpecificDesigner = async (updatedData, id, res) => {
    const { error } = DesignerSchema.validate(updatedData);
    if (error) {
        return res.status(400).send({ success: false, message: error.details[0].message });
    }

    try {
        const { name, team, joiningDate, password } = updatedData;

        const designerExist = await Designer.findById(id);

        if (!designerExist) {
            return res.status(404).send({ success: false, message: 'Designer not found' });
        }

        // Find the designer by ID and update
        const updatedDesigner = await Designer.findByIdAndUpdate(
            id,
            { name, joiningDate, password, team },
            { new: true, runValidators: true }
        );

        // Respond with the updated designer
        return res.status(200).send({ success: true, message: 'Designer updated successfully', designer: updatedDesigner });
    } catch (error) {
        console.error('Error updating designer:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

const deleteSpecificDesigner = async (id, res) => {
    try {
        // Find the designer by ID and delete
        const deletedDesigner = await Designer.findByIdAndDelete(id);

        // If the designer does not exist
        if (!deletedDesigner) {
            return res.status(404).send({ success: false, message: 'Designer not found' });
        }

        // Return success response
        return res.status(200).send({ success: true, message: 'Designer deleted successfully' });
    } catch (error) {
        console.error('Error deleting designer:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

export {
    getAllDesigners,
    addDesigner,
    updateSpecificDesigner,
    deleteSpecificDesigner,
}