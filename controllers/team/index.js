import {
    getAllTeams,
    addTeam,
    updateSpecificTeam,
    deleteSpecificTeam,
} from "../../services/index.js";

const addNewTeam = (req, res) => {
    const userObj = req.body;
    return addTeam(userObj, res);
}

const getTeams = (req, res) => {
    return getAllTeams(res);
}

const updateTeam = (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    return updateSpecificTeam(updatedData, id, res);
}

const deleteTeam = (req, res) => {
    const { id } = req.params;
    return deleteSpecificTeam(id, res);
}

export {
    getTeams,
    addNewTeam,
    updateTeam,
    deleteTeam,
}