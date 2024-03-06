import Joi from "joi";

export const talentUpgradeSchema = Joi.object({
    skills: Joi.string().allow(''),
    location: Joi.string().allow(''),
    avatar: Joi.string().allow(''),
    linkedIn: Joi.string().allow(''),
    instagram: Joi.string().allow(''),
    twitter: Joi.string().allow(''),
    onboardingPurpose: Joi.string().allow(''),
    otherPurpose: Joi.string().allow(''),
    step: Joi.number().allow(''),
});


export const businessUpgradeSchema = Joi.object({
    companyName: Joi.string().required(),
    logo: Joi.string().allow(''),
    avatar: Joi.string().allow(''),
    website: Joi.string().allow(''),
    location: Joi.string().required(),
    industry: Joi.string().required(),
    tagline: Joi.string().required(),
    size: Joi.string().required(),
    type: Joi.string().required(),
    linkedIn: Joi.string().allow(''),
    instagram: Joi.string().allow(''),
    twitter: Joi.string().allow(''),
    profession: Joi.string().required(),
});
