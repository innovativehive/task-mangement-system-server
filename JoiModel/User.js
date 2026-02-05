import Joi from "joi";

const UserSchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    userRights: Joi.object({
        salesForm: Joi.boolean().default(true),
        manage: Joi.boolean().default(false),
        reports: Joi.boolean().default(false),
        cashBooks: Joi.object({
            add: Joi.boolean().default(false),
            delete: Joi.boolean().default(false),
            report: Joi.boolean().default(false),
        }),
        dashboard: Joi.boolean().default(false),
        ledger: Joi.boolean().default(false),
    })
});

export default UserSchema;
