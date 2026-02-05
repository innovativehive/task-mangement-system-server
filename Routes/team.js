import express from "express";
import {
    getTeams,
    addNewTeam,
    updateTeam,
    deleteTeam,
} from "../controllers/team/index.js";

const Route = express.Router();

Route.get('/get', getTeams);
Route.post('/add', addNewTeam);
Route.put('/update/:id', updateTeam);
Route.delete('/delete/:id', deleteTeam);

export default Route;