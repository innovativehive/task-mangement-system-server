import User from "../../Model/User.js";
import Designer from "../../Model/Designer.js";
import jwt from 'jsonwebtoken';

const createUser = async (userObj, res) => {
    const { name, password } = userObj;
    try {
        const existingUser = await User.findOne({ name: "admin" });
        if (existingUser) {
            console.log("Initial user already exists");
            return;
        }

        const user = new User({
            name: name,
            password: password,
            role: 'admin',
        });

        await user.save();
        console.log("Initial user created successfully");

        return res.status(200).send({
            success: true,
            message: 'Created User',
            user: {
                name: user.name,
                _id: user._id,
                userRights: user.userRights,
            }
        });

    } catch (error) {
        console.log('error--->', error);
        return res.status(500).send({ success: false, message: error.message || 'Internal Server Error' });
    }
};

const authenticateExistingUser = async (userObj, res) => {
    const { name, password } = userObj;
    try {
        // Search in User collection
        let user = await User.findOne({ name: name.trim() });
        let role;

        // If user is found in the User collection, assign role as 'admin'
        if (user) {
            role = 'admin';
        } else {
            // If not found in User, search in Designer collection
            user = await Designer.findOne({ name: name.trim() });

            // If not found in both collections, return 404
            if (!user) {
                return res.status(404).send({ success: false, message: 'User not found' });
            }

            // If user is found in Designer, assign role as 'team leader'
            role = 'designer';
        }

        // Compare password (assuming passwords are hashed)
        const isMatch = Boolean(password === user.password);
        if (!isMatch) {
            return res.status(401).send({ success: false, message: 'Invalid password' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user._id, name: user.name, role }, // Payload
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '24h' } // Token expiry time
        );

        // If authentication succeeds, send user info along with their role and token
        return res.status(200).send({
            success: true,
            message: 'Authentication successful',
            token, // Send the token back to the client
            user: {
                name: user.name,
                _id: user._id,
                role,
            }
        });

    } catch (error) {
        console.log('error--->', error);
        return res.status(500).send({ success: false, message: error.message || 'Internal Server Error' });
    }
};

const changeUserPassword = async (oldPass, newPass, name, res) => {
    try {
        const userExist = await User.findOne({ name });

        const diff = Boolean(newPass !== userExist.password);
        if (!diff) {
            return res.status(400).send({ success: false, message: 'You cannot use previous password' });
        }

        const match = Boolean(userExist.password === oldPass);
        if (!match) {
            return res.status(400).send({ success: false, message: 'Old Password does not match' });
        }

        await User.updateOne(
            { name },
            {
                password: newPass,
            },
        );

        const updatedUser = await User.findOne({ name });

        return res.status(200).send({ success: true, message: 'Password updated', data: updatedUser });

    } catch (error) {
        console.log('error--->', error);
        return res.status(500).send({ success: false, message: error.message || 'Internal Server Error' });
    }
}


export {
    authenticateExistingUser,
    changeUserPassword,
    createUser
};

// fetch("http://localhost:8000/api/auth/create", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//         name: "admin",
//         password: "admin"
//     })
// })
// .then(res => res.json())
// .then(data => {
//     console.log(data);
// })
// .catch(err => {
//     console.error("Error:", err);
// });
