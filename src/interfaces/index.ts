export { IPaystackPayment } from './paystack'
import { Request, Response, NextFunction, RequestHandler } from 'express';

export interface Quote {
    anime: string;
    character: string;
    quote: string;
}
export interface QuotesQueryMap {
    filterType?: string;
    title?: string;
    name?: string;
    page?: number;
    pageSize?: number;
    fetchNew?: boolean;
}

export interface StringMap {
    [key: string]: any
}


interface User {
    id: string;
    username: string;
    [rest: string]: any
    // Add other user-related fields as needed
}

// Extend the existing Request type to include a user property
export interface RequestWithUser extends Request {
    user?: User;
}

// Define a modified RequestHandler type that accepts a RequestWithUser
export interface CustomRequestHandler extends RequestHandler {
    (req: RequestWithUser, res: Response, next: NextFunction): void;
};