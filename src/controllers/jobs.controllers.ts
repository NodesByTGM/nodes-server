import { RequestHandler } from "express";
import { AppConfig } from "../utilities/config";
import { BusinessModel, JobModel } from "../mongodb/models";

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
        return res.status(200).json({ message: AppConfig.STRINGS.Success, job })
    } catch (error) {
        return res.status(400).json({ error })
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
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound })
        }
        if (job.business._id.toString() !== req.user.business?._id.toString()) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.UnauthorizedAccess })
        }
        job.name = name || job.name
        job.description = description || job.description
        job.experience = experience || job.experience
        job.payRate = payRate || job.payRate
        job.workRate = workRate || job.workRate
        job.skills = skills || job.skills
        job.jobType = jobType || job.jobType

        await job.save()

        return res.status(200).json({ message: AppConfig.STRINGS.Success, job })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const deleteJobController: RequestHandler = async (req: any, res) => {
    // check if the user is the owner.
    try {
        const job = await JobModel.findById(req.params.id)
        if (!job) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound })
        }
        if (job.business._id.toString() !== req.user.business?._id.toString()) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound })
        }
        await job.deleteOne()
        return res.status(200).json({ message: AppConfig.STRINGS.Success })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const applyToJobController: RequestHandler = async (req: any, res) => {
    try {
        const job = await JobModel.findById(req.params.id)
        if (!job) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound })
        }
        if (job.applicants.filter(x => x.username === req.user.username).length > 0) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.AlreadyApplied })
        }
        job.applicants.push(req.user)
        await job.save()

        return res.status(200).json({ message: AppConfig.STRINGS.Success, job })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const getJobsController: RequestHandler = async (req: any, res) => {
    try {
        let jobs;
        if (req.query.businessId) {
            jobs = await JobModel.find({ business: req.query.businessId }).populate('business')
        } else {
            jobs = await JobModel.find({}).populate('business')
        }
        return res.status(200).json({ message: AppConfig.STRINGS.Success, jobs })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const getJobController: RequestHandler = async (req: any, res) => {
    try {
        const job = await JobModel.findById(req.params.id).populate('business')

        return res.status(200).json({ message: AppConfig.STRINGS.Success, job })
    } catch (error) {
        return res.status(400).json({ error })
    }
}
