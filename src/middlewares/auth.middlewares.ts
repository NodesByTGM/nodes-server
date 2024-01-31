
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../interfaces';
import { AccountModel } from '../mongodb/models';
import { AppConfig } from '../utilities/config';

const authenticate = async (req: RequestWithUser, res:Response, next:NextFunction) => {
    // const token = req.headers.authorization?.split(' ')[1];
    const token = req?.cookies?.nodesToken;

    if (!token) {
        return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
    }

    try {
        const decodedToken: any = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
        const user:any = await AccountModel.findById(decodedToken?.accountId);
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