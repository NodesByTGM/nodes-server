import Joi from "joi";

export const emailSchema = Joi.object({
    email: Joi.string().required(),
});


export const usernameSchema = Joi.object({
    username: Joi.string().required(),
});

export const registerSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required(),
    dob: Joi.date().required(),
    password: Joi.string().required(),
    otp: Joi.string().allow(''),
});

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
})

export const sendOTPSchema = Joi.object({
    // name: Joi.string().required(),
    email: Joi.string().required(),
    // password: Joi.string().required(),
})


export const verifyEmailSchema = Joi.object({
    otp: Joi.string().required(),
    email: Joi.string().allow('')
})


export const verifyOTPSchema = Joi.object({
    otp: Joi.string().required(),
    email: Joi.string().allow('')
})