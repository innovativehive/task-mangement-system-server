import {
    createUser,
    authenticateExistingUser,
    changeUserPassword,
} from "../../services/index.js";

const createNewUser = (req, res) => {
    const userObj = req.body;
    return createUser(userObj, res);
}

const authenticateUser = (req, res) => {
    const userObj = req.body;
    return authenticateExistingUser(userObj, res);
}

const changePassword = (req, res) => {
    const { oldPass, newPass, name } = req.params;
    return changeUserPassword(oldPass, newPass, name, res);
}

export {
    createNewUser,
    authenticateUser,
    changePassword,
}