
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../interfaces';
import { AccountModel } from '../mongodb/models';
import { AppConfig } from '../utilities/config';

const authenticate = async (req: RequestWithUser | Request, res: Response, next: NextFunction) => {
    try {
        let token = req?.cookies?.nodesToken;
        if (!token) {
            token = req.headers.authorization?.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
        }

        const decodedToken: any = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
        const user: any = await AccountModel.findById(decodedToken?.accountId);
        if (!user) {
            return res.status(404).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
    }
};

export default authenticate;