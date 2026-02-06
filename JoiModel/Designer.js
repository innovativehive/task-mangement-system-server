import Joi from 'joi';

const DesignerSchema = Joi.object({
    name: Joi.string().required(),
    team: Joi.string().required(),
    joiningDate: Joi.date().iso().required(),
    password: Joi.string().required(),
});

export default DesignerSchema;
