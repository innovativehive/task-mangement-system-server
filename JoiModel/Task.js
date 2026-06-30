import Joi from "joi";

const CharacterSchema = Joi.object({
  description: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Character description is required"
    }),

  image: Joi.object({
    url: Joi.string().allow("", null),
    publicId: Joi.string().allow("", null)
  }).optional().allow(null),
});

const TaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .required(),

  saleCode: Joi.string()
    .trim()
    .required(),

  assignedTo: Joi.string()
    .required(),

  numberOfCharacters: Joi.number()
    .integer()
    .min(1)
    .required(),

  characters: Joi.array()
    .items(CharacterSchema)
    .min(1)
    .required(),

  urgent: Joi.boolean()
    .default(false),

  status: Joi.string()
    .valid(
      "created",
      "assigned",
      "inProgress",
      "pendingApproval",
      "rejected",
      "completed"
    )
    .default("created"),

  fifoOrder: Joi.number()
    .integer()
    .positive()
    .required(),

  submissionUrl: Joi.string()
    .uri()
    .allow("", null),

  dueDate: Joi.date()
    .iso()
    .optional(),

  username: Joi.string()
    .trim()
    .min(3)
    .required(),
});

export default TaskSchema;