// const jobs = await JobModel.aggregate([
//     { $match: { business } },
//     {
//       $lookup: {
//         from: "businesses",
//         localField: "business",
//         foreignField: "_id",
//         as: "business"
//       }
//     },
//     {
//       $lookup: {
//         from: "users",  // Assuming saves and applicants reference the users collection
//         localField: "saves",
//         foreignField: "_id",
//         as: "saves"
//       }
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "applicants",
//         foreignField: "_id",
//         as: "applicants"
//       }
//     },
//     {
//       $addFields: {
//         business: { $arrayElemAt: ["$business", 0] }, // Deconstructing the array
//         applied: {
//           $in: [mongoose.Types.ObjectId(req.user.id), "$applicants._id"]
//         },
//         saved: {
//           $in: [mongoose.Types.ObjectId(req.user.id), "$saves._id"]
//         }
//       }
//     },
//     {
//       $project: {
//         business: 0, // Exclude business field if not needed
//         saves: 0,    // Exclude saves field if not needed
//         applicants: 0 // Exclude applicants field if not needed
//       }
//     },
//     { $unwind: "$business" } // Unwind the business field
//   ]);

import { Response } from "express"
import { AppConfig } from "../utilities/config"

//   // If you want to convert the ObjectId to string in JavaScript, you can map through the jobs array
//   const jobsWithAppliedAndSaved = jobs.map(job => ({
//     ...job,
//     applied: job.applied.toString(),
//     saved: job.saved.toString()
//   }));

//   // jobsWithAppliedAndSaved now contains the jobs array with applied and saved fields converted to string

const codeKVP = {
    200: AppConfig.STRINGS.Success,
    201: AppConfig.STRINGS.Success,
    400: AppConfig.ERROR_MESSAGES.BadRequestError,
    404: AppConfig.ERROR_MESSAGES.NotFoundError,
    500: AppConfig.ERROR_MESSAGES.InternalServerError
}

const successCodes = [200, 201]

// const result = {
//     status: "success - failure",
//     code: 201,
//     message: "",
//     result: {},
//     isError: true,
// }


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
    const _res = {
        apiObject,
        code,
        status: isSuccess ? 'success' : 'failure',
        isError: !isSuccess,
        message,
        result: data,
    }
    return res.status(code).json(_res)
}


// "api": "Nodes",
// "description": "Nodes.",
// "enviroment": 
// "version": 