import Joi from "joi";

const TaskSchema = Joi.object({
  title: Joi.string().trim().min(3).required(),

  description: Joi.string().allow("").optional(),

  assignedTo: Joi.string().required(),

  urgent: Joi.boolean().default(false),

  status: Joi.string().valid(
    "assigned",
    "inProgress",
    "pendingApproval",
    "rejected",
    "completed"
  ).default("assigned"),

  fifoOrder: Joi.number().integer().positive().required(),

  submissionUrl: Joi.string().uri().allow(null, ""),

  feedback: Joi.string().allow(null, ""),

  dueDate: Joi.date().iso().optional()
});

export default TaskSchema;
