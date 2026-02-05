import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TeamLeaderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const TeamLeader = model('TeamLeader', TeamLeaderSchema);

export default TeamLeader;
