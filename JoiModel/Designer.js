import Joi from 'joi';

const SalesManSchema = Joi.object({
    name: Joi.string().required(),
    team: Joi.string().required(),
    joiningDate: Joi.date().iso().required(),
    password: Joi.string().required(),
});

export default SalesManSchema;
