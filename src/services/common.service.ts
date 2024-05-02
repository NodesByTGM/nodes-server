import { Response } from "express";
import { AppConfig } from "../utilities/config";

const codeKVP = {
    200: AppConfig.STRINGS.Success,
    201: AppConfig.STRINGS.Success,
    400: AppConfig.ERROR_MESSAGES.BadRequestError,
    404: AppConfig.ERROR_MESSAGES.NotFoundError,
    500: AppConfig.ERROR_MESSAGES.InternalServerError
}
const successCodes = [200, 201]

export const constructResponse = ({
    res,
    message,
    data = {},
    code,
    apiObject
}: {
    res: Response,
    message: string,
    data?: any,
    code: number,
    apiObject: string
}) => {
    const isSuccess = successCodes.includes(code)
    if (!isSuccess && process.env.NODE_ENV === 'development') {
        console.log('[error]:', data.toString());
    }

    const _res = {
        apiObject,
        code,
        status: isSuccess ? 'success' : 'failure',
        isError: !isSuccess,
        message,
        errorMessage: !isSuccess ? data.toString() : undefined,
        result: data,
    }
    return res.status(code).json(_res)
}

// {
//     $project: {
//         title: 1,
//         description: 1,
//         applicants: {
//             $cond: {
//                 if: { $eq: ['$business', new Types.ObjectId(req.user.business.id)] },
//                 then: '$applicants',
//                 else: { $size: '$applicants' } // Return the size of the applicants array
//             }
//         }
//     }
// },