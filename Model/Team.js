import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Team = model('Team', TeamSchema);

export default Team;
