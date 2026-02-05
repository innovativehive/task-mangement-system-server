import Joi from 'joi';

const TeamLeaderSchema = Joi.object({
    name: Joi.string().required(),
});

export default TeamLeaderSchema;
