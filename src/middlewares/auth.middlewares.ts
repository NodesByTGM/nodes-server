
import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../interfaces';
import { AccountModel, AdminModel } from '../mongodb/models';
import { verifyAccessToken } from '../services/auth.service';
import { AppConfig } from '../utilities/config';
import { constructResponse } from '../services';

const isAuthenticated = async (req: RequestWithUser | Request, res: Response, next: NextFunction) => {
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

const isBusinessAccount = async (req: RequestWithUser | Request, res: Response, next: NextFunction) => {
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

        if (!user.business) {
            return constructResponse({
                res,
                code: 403,
                message: AppConfig.ERROR_MESSAGES.NotBusiness,
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

const isAdmin = async (req: RequestWithUser | Request, res: Response, next: NextFunction) => {
    try {
        let token = req?.cookies?.nodesAdminToken;
        if (!token) {
            token = req.headers.authorization?.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
        }
        const decodedToken: any = verifyAccessToken(token);
        const user: any = await AdminModel.findById(decodedToken?.accountId);
        if (!user) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
    }
};

const isSuperAdmin = async (req: RequestWithUser | Request, res: Response, next: NextFunction) => {
    try {
        let token = req?.cookies?.nodesAdminToken;
        if (!token) {
            token = req.headers.authorization?.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
        }
        const decodedToken: any = verifyAccessToken(token);
        const user: any = await AdminModel.findById(decodedToken?.accountId);
        if (!user) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
        }
        if (user.role !== AppConfig.ADMIN_ROLES.SUPERADMIN) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.PermissionsDenied });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
    }
};

const isAdminOrUser = async (req: RequestWithUser | Request, res: Response, next: NextFunction) => {
    try {
        let token = req?.cookies?.gridsAdminToken;
        if (!token) {
            token = req.headers.authorization?.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
        }
        const decodedToken: any = verifyAccessToken(token);
        const user: any = await AccountModel.findById(decodedToken?.accountId);
        const admin: any = await AdminModel.findById(decodedToken?.accountId);
        if (!user) {
            if (!admin) {
                return res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
            }
        }

        req.user = user || admin;
        next();
    } catch (error) {
        res.status(401).json({ message: AppConfig.ERROR_MESSAGES.AuthenticationError });
    }
};


// create a middleware for active subscriptions

const AuthMiddlewares = {
    isAuthenticated,
    isBusinessAccount,
    isAdmin,
    isSuperAdmin,
    isAdminOrUser,
}

export default AuthMiddlewares