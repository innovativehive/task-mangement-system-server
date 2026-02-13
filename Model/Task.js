import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    saleCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Designer",
        required: true
    },

    urgent: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: [
            "assigned",
            "inProgress",
            "pendingApproval",
            "rejected",
            "completed"
        ],
        default: "assigned",
    },

    fifoOrder: {
        type: Number,
        required: true,
        index: true
    },

    submissionUrl: {
        type: String
    },

    feedback: {
        type: String
    },

    dueDate: {
        type: Date
    },

    referenceImage: [
        {
            url: {
                type: String,
                required: true
            },
            publicId: {
                type: String,
                required: true
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    approvalWork: [
        {
            url: {
                type: String,
                required: true
            },
            publicId: {
                type: String,
                required: true
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, { timestamps: true });


const Task = model('Task', TaskSchema);

export default Task;