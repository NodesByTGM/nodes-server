import { Request, Response, NextFunction } from 'express';
import { AppConfig } from '../utilities/config';
import { quoteBodySchema, quoteParamSchema, quoteQuerySchema } from '../validations';

// Define a type for middleware
type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;

export const quoteQueryValidate: MiddlewareFunction = async (req, res, next) => {
    try {
        const { error } = quoteQuerySchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        next();
    } catch (error) {
        res.status(401).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError });
    }
};

export const quoteBodyValidate: MiddlewareFunction = async (req, res, next) => {

    try {
        const { error } = quoteBodySchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        next();
    } catch (error) {
        res.status(401).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError });
    }
};


export const quoteParamsValidate: MiddlewareFunction = async (req, res, next) => {
    try {
        const { error } = quoteParamSchema.validate(req.params);
        if (error) return res.status(400).json({ message: error.details[0].message });
        next();
    } catch (error) {
        res.status(401).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError });
    }
};
