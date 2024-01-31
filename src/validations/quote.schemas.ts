import Joi from "joi";

export const quoteQuerySchema = Joi.object({
    filterType: Joi.string(),
    title: Joi.string(),
    name: Joi.string(),
    page: Joi.number(),
    pageSize: Joi.number(),
    fetchNew: Joi.boolean()
});

export const quoteBodySchema = Joi.object({
    anime: Joi.string().required(),
    title: Joi.string().required(),
    quote: Joi.string().required(),
});

export const quoteParamSchema = Joi.object({
    id: Joi.string().required(),
});
