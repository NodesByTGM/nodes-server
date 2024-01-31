import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required(),
    dob: Joi.date().required(),
    password: Joi.string().required(),
    avatar: Joi.string()
});

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
})

export const sendOTPSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
})


export const verifyEmailSchema = Joi.object({
    otp: Joi.string().required(),
    name: Joi.string().allow(''),
    email: Joi.string().allow('')
})