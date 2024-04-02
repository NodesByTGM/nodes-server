import { NextFunction, Request, Response } from "express";

export const UserResponse = (
    req: Request,
    res: Response,
    Next: NextFunction
) => {
    try {
        if (res.locals?.apiResponse) {
            if (
                res.locals.apiResponse?.status == 1 &&
                typeof res.locals.apiResponse?.data === "object" &&
                res.locals.apiResponse?.data.constructor.modelName === "User"
            ) {
                const tempUser = res.locals.apiResponse?.data.toObject();
                /* Delete all private fields so that only necessary fields are exposed */
                return res.status(200).json({
                    status: res.locals.apiResponse?.status,
                    data: tempUser,
                });
            }
        }
        return res.status(200).json(res.locals);
    } catch (error) {
        res.status(500).json({ status: 0, error });
    }
};
