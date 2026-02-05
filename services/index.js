import {
    createUser,
    authenticateExistingUser,
    changeUserPassword,
} from "./auth/index.js";

import {
    getAllTeams,
    addTeam,
    updateSpecificTeam,
    deleteSpecificTeam,
} from "./team/index.js";

import {
    getAllDesigners,
    addDesigner,
    updateSpecificDesigner,
    deleteSpecificDesigner,
} from "./designer/index.js";

export {
    //auth
    createUser,
    authenticateExistingUser,
    changeUserPassword,
    //Team Leader
    addTeam,
    getAllTeams,
    updateSpecificTeam,
    deleteSpecificTeam,
    //Designer
    getAllDesigners,
    addDesigner,
    updateSpecificDesigner,
    deleteSpecificDesigner,
}