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
        const job = await JobModel.findById(req.params.id).populate('business')
        if (!job) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Job
            })
        }
        const data = {
            ...job?.toJSON(),
            applied: job.applicants.includes(req.user.id),
            saved: job.saves.includes(req.user.id),
            saves: undefined,
            _applicants:undefined
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
        let jobs;
        if (req.query.businessId) {
            jobs = await JobModel.find({ business: req.query.businessId })
                .populate('business').lean()
        } else {
            jobs = await JobModel.find({}).populate('business').lean()
        }
        jobs = jobs.map(x => ({
            ...x,
            applied: x.applicants.map((y: any) => y.toString()).includes(req.user.id),
            saved: x.saves.map((y: any) => y.toString()).includes(req.user.id),
            saves: x.business === req.user.business ? x.saves : undefined,
            applicants: x.business === req.user.business ? x.applicants : undefined
        }))
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
        let jobs: any = await JobModel.find({ 'applicants': req.user.id }).lean()
        jobs = jobs.map((x: any) => ({
            ...x,
            applied: x.applicants.map((y: any) => y.toString()).includes(req.user.id),
            saved: x.saves.map((y: any) => y.toString()).includes(req.user.id),
            saves: undefined,
            applicants: undefined
        }))
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
        let jobs: any = await JobModel.find({ 'saves': req.user.id }).lean()
        jobs = jobs.map((x: any) => ({
            ...x,
            applied: x.applicants.map((y: any) => y.toString()).includes(req.user.id),
            saved: x.saves.map((y: any) => y.toString()).includes(req.user.id),
            saves: undefined,
            applicants: undefined
        }))
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
        let jobs = await JobModel.find({ business }).populate('business saves applicants').lean()
        jobs = jobs.map(x => ({
            ...x,
            applied: x.applicants.map((y: any) => y._id.toString()).includes(req.user.id),
            saved: x.saves.map((y: any) => y._id.toString()).includes(req.user.id),
        }))
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
// .aggregate([
//     {
//         "$addFields": {
//             "saved": { "$in": [req.user.id, "$saves"] }
//         }
//     }
// ])
// 