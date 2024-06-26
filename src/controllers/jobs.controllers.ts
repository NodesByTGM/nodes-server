import { RequestHandler } from "express";
import { AccountModel, JobModel, NotificationModel } from "../mongodb/models";
import { constructResponse } from "../services";
import { getRegexList, paginateData } from "../utilities/common";
import { AppConfig } from "../utilities/config";

const createJob: RequestHandler = async (req: any, res) => {
    try {
        const {
            name,
            description,
            experience,
            payRate,
            workRate,
            skills,
            jobType,
            location,
        } = req.body
        const job = await JobModel.create({
            name,
            description,
            experience,
            payRate,
            workRate,
            skills,
            jobType,
            location,
            business: req.user.business
        })
        return constructResponse({
            res,
            data: job,
            code: 201,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    }
}

const updateJob: RequestHandler = async (req: any, res) => {
    try {
        const {
            name,
            description,
            experience,
            payRate,
            workRate,
            skills,
            jobType,
            location,
        } = req.body
        const job = await JobModel.findById(req.params.id)
        if (!job) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }
        if (job.business._id.toString() !== req.user.business?._id.toString()) {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.UnauthorizedAccess,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }
        job.name = name || job.name
        job.description = description || job.description
        job.experience = experience || job.experience
        job.payRate = payRate || job.payRate
        job.workRate = workRate || job.workRate
        job.skills = skills || job.skills
        job.jobType = jobType || job.jobType
        job.location = location || job.location

        await job.save()

        await JobModel.populate(job, [
            { path: 'applicants', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
        ]);

        return constructResponse({
            res,
            data: job,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    }
}

const deleteJob: RequestHandler = async (req: any, res) => {
    // check if the user is the owner.
    try {
        const job = await JobModel.findById(req.params.id)
        if (!job) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }
        if (job.business._id.toString() !== req.user.business?._id.toString()) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }
        await job.deleteOne()

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    }
}

const applyToJob: RequestHandler = async (req: any, res) => {
    try {
        let job = await JobModel.findOne({ _id: req.params.id })
        if (!job) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }
        if (job.applicants.filter(x => x.toString() === req.user._id.toString()).length > 0) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.AlreadyApplied,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }
        job.applicants.push(req.user)
        await job.save()

        const owner = await AccountModel.find({ business: job.business })
        if (owner) {
            await NotificationModel.create({
                account: owner,
                message: `${req.user.name} just applied for ${job.name} `,
                foreignKey: req.user.id.toString(),
                type: AppConfig.NOTIFICATION_TYPES.JOB_APPLICATION,
            })
        }

        const data: any = job.toJSON()
        data.saves = job.saves.length
        data.applicants = job.applicants.length
        data.applied = true
        data.saved = job.saves.map(x => x.id).includes(req.user.id)

        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    }
}

const saveJob: RequestHandler = async (req: any, res) => {
    try {
        const job = await JobModel.findById(req.params.id)
        if (!job) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }
        if (job.saves.filter(x => x.id.toString() === req.user.id.toString()).length > 0) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.AlreadySavedJob,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }

        job.saves.push(req.user)
        await job.save()

        const data: any = job.toJSON()
        data.saves = job.saves.length
        data.applicants = job.applicants.length
        data.saved = true
        data.applied = job.applicants.map(x => x.id).includes(req.user.id)

        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    }
}

const unsaveJob: RequestHandler = async (req: any, res) => {
    try {
        const job = await JobModel.findById(req.params.id)
        if (!job) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }
        if (job.saves.filter(x => x.id.toString() === req.user.id.toString()).length > 0) {
            job.saves = job.saves.filter(x => x.id.toString() !== req.user.id.toString())
            await job.save()
        }
        const data: any = job.toJSON()
        data.saves = job.saves.length
        data.applicants = job.applicants.length
        data.saved = false
        data.applied = job.applicants.map(x => x.id).includes(req.user.id)

        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    }
}

const getJob: RequestHandler = async (req: any, res) => {
    try {
        const job = await JobModel.findById(req.params.id)
        if (!job) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }


        await JobModel.populate(job, [
            { path: 'applicants', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
        ]);

        // TODO HIDE BASED ON OWNER
        const data = {
            ...job?.toJSON(),
            applied: job.applicants.map(x => x.id).includes(req.user.id),
            saved: job.saves.map(x => x.id).includes(req.user.id),
            saves: job.business === req.user.business ? job.saves : job.saves.length,
            applicants: job.business === req.user.business ? job.applicants : job.applicants.length,
        }
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    }
}

const getJobs: RequestHandler = async (req: any, res) => {
    try {
        const { skills, search, role, workRate, payRate, jobType } = req.query;
        // Construct base query
        let query: any = {};
        let searchQuery: any = {};

        // Add filters based on parameters
        if (skills) {
            if (typeof (skills) === 'object') {
                query.skills = {
                    $elemMatch: { $in: getRegexList(skills) }
                };
            } else {
                query.skills = { $regex: skills, $options: 'i' };
            }

        }
        if (role) {
            if (typeof (role) === 'object') {
                query.role = {
                    $elemMatch: { $in: getRegexList(role) }
                };
            } else {
                query.role = { $regex: role, $options: 'i' };
            }

        }
        if (payRate) {
            if (typeof (payRate) === 'object') {
                query.payRate = {
                    $elemMatch: { $in: getRegexList(payRate) }
                };
            } else {
                query.payRate = { $regex: payRate, $options: 'i' };
            }

        }
        if (jobType) {
            if (typeof (jobType) === 'object') {
                query.jobType = {
                    $elemMatch: { $in: getRegexList(jobType) }
                };
            } else {
                query.jobType = { $regex: jobType, $options: 'i' };
            }

        }
        if (workRate) {
            if (typeof (workRate) === 'object') {
                query.workRate = {
                    $elemMatch: { $in: getRegexList(workRate) }
                };
            } else {
                query.workRate = { $regex: workRate, $options: 'i' };
            }

        }

        if (search) {
            searchQuery = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' }, },
                    { description: { $regex: search, $options: 'i' }, },
                ]
            }
        }
        const userId = req.user.id.toString()
        // TODO HIDE BASED ON OWNER
        const jobs = await JobModel.aggregate([
            { $match: query },
            { $match: searchQuery },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    applied: {
                        $in: [userId, { $map: { input: "$applicants", as: "applied", in: { $toString: "$$applied" } } }]
                    },
                    saved: {
                        $in: [userId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }]
                    }
                }
            },
            { $addFields: { applicants: { $size: '$applicants' }, saves: { $size: '$saves' } } },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] }
        ]);
        await JobModel.populate(jobs, [
            // { path: 'applicants', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            // { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
        ]);

        const data = paginateData(req.query, jobs, 'jobs')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    }
}

const getAppliedJobs: RequestHandler = async (req: any, res) => {
    try {
        const userId = req.user.id.toString()
        const jobs = await JobModel.aggregate([
            { $match: { applicants: req.user._id } },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    applied: {
                        $in: [userId, { $map: { input: "$applicants", as: "applied", in: { $toString: "$$applied" } } }]
                    },
                    saved: {
                        $in: [userId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }]
                    }
                }
            },
            { $addFields: { applicants: { $size: '$applicants' }, saves: { $size: '$saves' } } },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] } //"applicants", "saves"
        ]);
        await JobModel.populate(jobs, [
            // { path: 'applicants', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            // { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
        ]);
        const data = paginateData(req.query, jobs, 'jobs')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    }
}

const getSavedJobs: RequestHandler = async (req: any, res) => {
    try {
        const userId = req.user.id.toString()
        const jobs = await JobModel.aggregate([
            { $match: { saves: req.user._id } },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    applied: {
                        $in: [userId, { $map: { input: "$applicants", as: "applied", in: { $toString: "$$applied" } } }]
                    },
                    saved: {
                        $in: [userId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }]
                    }
                }
            },
            { $addFields: { applicants: { $size: '$applicants' }, saves: { $size: '$saves' } } },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] }
        ]);
        await JobModel.populate(jobs, [
            // { path: 'applicants', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            // { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
        ]);
        const data = paginateData(req.query, jobs, 'jobs')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    }
}

const getMyJobs: RequestHandler = async (req: any, res) => {
    try {
        const { search } = req.query;
        // Construct base query
        let searchQuery: any = {};

        if (search) {
            searchQuery = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' }, },
                    { description: { $regex: search, $options: 'i' }, },
                ]
            }
        }
        const business = req.user.business
        const userId = req.user.id.toString()
        const jobs = await JobModel.aggregate([
            { $match: { business: business._id } },
            { $match: searchQuery },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    applied: {
                        $in: [userId, { $map: { input: "$applicants", as: "applied", in: { $toString: "$$applied" } } }]
                    },
                    saved: {
                        $in: [userId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }]
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
        const data = paginateData(req.query, jobs, 'jobs')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Job
        })
    }
}

export default {
    createJob,
    updateJob,
    deleteJob,
    applyToJob,
    saveJob,
    unsaveJob,
    getJobs,
    getJob,
    getSavedJobs,
    getAppliedJobs,
    getMyJobs
}
