import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SalesManSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    joiningDate: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

const SalesMan = model('SalesMan', SalesManSchema);

export default SalesMan;
