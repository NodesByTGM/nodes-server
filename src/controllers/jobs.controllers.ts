import { RequestHandler } from "express";
import { BusinessModel, JobModel } from "../mongodb/models";
import { constructResponse } from "../services";
import { paginateData } from "../utilities/common";
import { AppConfig } from "../utilities/config";

export const jobCreateController: RequestHandler = async (req: any, res) => {
    try {
        const {
            name,
            description,
            experience,
            payRate,
            workRate,
            skills,
            jobType,
        } = req.body
        // TODO: remove this
        if (!req.user.business) {
            const business = await BusinessModel.create({
                name: req.user.name,
                yoe: new Date(Date.now()),
                account: req.user
            })
            req.user.business = business
            await req.user.save()
        }
        const job = await JobModel.create({
            name,
            description,
            experience,
            payRate,
            workRate,
            skills,
            jobType,
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

export const jobUpdateController: RequestHandler = async (req: any, res) => {
    try {
        const {
            name,
            description,
            experience,
            payRate,
            workRate,
            skills,
            jobType,
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

        await job.save()

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

export const deleteJobController: RequestHandler = async (req: any, res) => {
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

export const applyToJobController: RequestHandler = async (req: any, res) => {
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
        job.applicants.push(req.user.id)
        await job.save()
        const data: any = job.toJSON()
        delete data.saves
        delete data.applicants
        data.applied = true
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

export const saveJobController: RequestHandler = async (req: any, res) => {
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
        if (job.saves.filter(x => x.toString() === req.user.id.toString()).length > 0) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.AlreadySavedJob,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }
        job.saves.push(req.user.id)
        await job.save()
        const data: any = job.toJSON()
        delete data.saves
        delete data.applicants
        data.saved = true

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

export const unsaveJobController: RequestHandler = async (req: any, res) => {
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
        if (job.saves.filter(x => x.toString() === req.user.id.toString()).length > 0) {
            job.saves = job.saves.filter(x => x.toString() !== req.user.id.toString())
            await job.save()
        }
        const data: any = job.toJSON()
        delete data.saves
        delete data.applicants
        data.saved = false

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

export const getJobController: RequestHandler = async (req: any, res) => {
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

        // TODO HIDE BASED ON OWNER
        const data = {
            ...job?.toJSON(),
            applied: job.applicants.includes(req.user.id),
            saved: job.saves.includes(req.user.id),
            saves: job.business === req.user.business ? job.saves : undefined,
            applicants: job.business === req.user.business ? job.applicants : undefined,
        }
        return constructResponse({
            res,
            data: data,
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

export const getJobsController: RequestHandler = async (req: any, res) => {
    try {
        const userId = req.user.id.toString()
        // TODO HIDE BASED ON OWNER
        const jobs = await JobModel.aggregate([
            // { $match: { saves: req.user._id } },
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
            // { path: 'applicants', select: 'name id avatar', options: { autopopulate: false } },
            // { path: 'saves', select: 'name id avatar', options: { autopopulate: false } },
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

export const getAppliedJobsController: RequestHandler = async (req: any, res) => {
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
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] } //"applicants", "saves"
        ]);
        await JobModel.populate(jobs, [
            { path: 'applicants', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'saves', select: 'name id avatar', options: { autopopulate: false } },
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

export const getSavedJobsController: RequestHandler = async (req: any, res) => {
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
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] }
        ]);
        await JobModel.populate(jobs, [
            { path: 'applicants', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'saves', select: 'name id avatar', options: { autopopulate: false } },
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

export const getMyJobsController: RequestHandler = async (req: any, res) => {
    try {
        const business = req.user.business
        const userId = req.user.id.toString()
        const jobs = await JobModel.aggregate([
            { $match: { business: business._id } },
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
            { path: 'applicants', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'saves', select: 'name id avatar', options: { autopopulate: false } },
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
