
import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../interfaces';
import { AccountModel } from '../mongodb/models';
import { verifyAccessToken } from '../services/auth.service';
import { AppConfig } from '../utilities/config';
import { constructResponse } from '../services';

const authenticate = async (req: RequestWithUser | Request, res: Response, next: NextFunction) => {
    try {
        let token = req?.cookies?.nodesToken;
        if (!token) {
            token = req.headers.authorization?.split(' ')[1];
        }

        if (!token) {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.AuthenticationError,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }

        const decodedToken: any = verifyAccessToken(token);
        const user: any = await AccountModel.findById(decodedToken?.accountId);
        if (!user) {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.AuthenticationError,
                apiObject: AppConfig.API_OBJECTS.Auth
            })
        }

        req.user = user;
        next();
    } catch (error) {
        return constructResponse({
            res,
            code: 401,
            message: AppConfig.ERROR_MESSAGES.AuthenticationError,
            apiObject: AppConfig.API_OBJECTS.Auth
        })
    }
};

// create a middleware for active subscriptions

export default authenticate;