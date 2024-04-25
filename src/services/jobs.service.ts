import { JobModel } from "../mongodb/models";

export const getUserJobs = async (user: any, reqUser: any) => {
    const business = user.business
    // const userId = user.id.toString()
    const reqUserId = reqUser.id.toString()
    const jobs = await JobModel.aggregate([
        { $match: { business: business?._id || '' } },
        { $sort: { createdAt: -1 } },
        {
            $addFields: {
                applied: {
                    $in: [reqUserId, { $map: { input: "$applicants", as: "applied", in: { $toString: "$$applied" } } }]
                },
                saved: {
                    $in: [reqUserId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }]
                }
            }
        },
        { $addFields: { id: "$_id" } },
        { $unset: ["_id", "__v"] }
    ]);
    await JobModel.populate(jobs, [
        { path: 'applicants', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
        { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
        { path: 'business' },
    ]);

    return jobs
}

export default {
    getUserJobs
}