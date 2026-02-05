import Team from "../../Model/Team.js";
import TeamSchema from "../../JoiModel/Team.js";
import Designer from "../../Model/Designer.js";

const addTeam = async (userObj, res) => {
    // Validate incoming request
    const { error } = TeamSchema.validate(userObj);
    if (error) {
        console.error('Error :', error);
        return res.status(400).send({ success: false, message: error.details[0].message });
    }

    try {
        const { name } = userObj;

        // Check if team leader already exists by phone
        const existingLeader = await Team.findOne({ name });
        if (existingLeader) {
            return res.status(409).send({ success: false, message: 'Team leader already exists with this name' });
        }

        // Create a new team leader
        const newTeam = new Team({
            name,
        });

        await newTeam.save(); // Save to the database

        return res.status(201).send({ success: true, message: 'Team leader added successfully', team: newTeam });
    } catch (error) {
        console.error('Error adding team leader:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

const getAllTeams = async (res) => {
    try {
        // Fetch all team leaders from the database
        const teams = await Team.find({}).sort({ name: 1 });

        // Check if there are any team leaders
        if (teams.length === 0) {
            return res.status(404).send({ success: false, message: 'No team leaders found' });
        }

        // Send response with team leaders
        return res.status(200).send({ success: true, teams });
    } catch (error) {
        console.error('Error fetching team leaders:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

const updateSpecificTeam = async (updatedData, id, res) => {
    // Validate incoming data using Joi
    const { error } = TeamSchema.validate(updatedData);
    if (error) {
        return res.status(400).send({ success: false, message: error.details[0].message });
    }

    try {

        const { name } = updatedData;

        // Find the team leader by ID and update
        const teamExist = await Team.findById(id);

        if (!teamExist) {
            return res.status(404).send({ success: false, message: 'Team leader not found' });
        }

        await Designer.updateMany(
            { team: teamExist.name },
            { team: name },
        )

        // Find the team leader by ID and update
        const updatedTeam = await Team.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        // Respond with the updated team leader
        return res.status(200).send({ success: true, message: 'Team leader updated successfully', team: updatedTeam });
    } catch (error) {
        console.error('Error updating team leader:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}


const deleteSpecificTeam = async (id, res) => {
    try {

        const teamExist = await Team.findById(id);
        // If the Team does not exist
        if (!teamExist) {
            return res.status(404).send({ success: false, message: 'Team not found' });
        }

        const designerExist = await Designer.find({ team: teamExist.name.toLowerCase() })

        if (designerExist.length > 0) {
            return res.status(404).send({ success: false, message: 'Firstly you have to delete/move all Designer of this team leader' });
        }

        // Find the Team by ID and delete
        await Team.findByIdAndDelete(id);

        // Return success response
        return res.status(200).send({ success: true, message: 'Team deleted successfully' });
    } catch (error) {
        console.error('Error deleting Team:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

export {
    getAllTeams,
    addTeam,
    updateSpecificTeam,
    deleteSpecificTeam,
}