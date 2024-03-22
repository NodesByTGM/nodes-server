import { RequestHandler } from "express";
import { AppConfig } from "../utilities/config";
import { BusinessModel, EventModel } from "../mongodb/models";
import { uploadMedia } from "../services";
import { paginateData } from "../utilities/common";

export const eventCreateController: RequestHandler = async (req: any, res) => {
    try {
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
        const {
            name,
            description,
            location,
            dateTime,
            paymentType,
            thumbnail
        } = req.body
        const imgUrl = await uploadMedia(thumbnail)
        const event = await EventModel.create({
            name,
            description,
            location,
            dateTime,
            paymentType,
            business: req.user.business,
            thumbnail: imgUrl
        })
        // const events = await EventModel.find({}).populate('business')
        // const data = paginateData(req.query, events, 'events')
        return res.status(200).json({ message: AppConfig.STRINGS.Success, event })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error })
    }
}

export const eventUpdateController: RequestHandler = async (req: any, res) => {
    try {
        const {
            name,
            description,
            location,
            dateTime,
            paymentType,
            thumbnail
        } = req.body
        const event = await EventModel.findById(req.params.id)
        if (!event) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound })
        }
        if (event.business._id.toString() !== req.user.business?._id.toString()) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.UnauthorizedAccess })
        }
        const imgUrl = await uploadMedia(thumbnail)

        event.name = name || event.name
        event.description = description || event.description
        event.location = location || event.location
        event.dateTime = dateTime || event.dateTime
        event.paymentType = paymentType || event.paymentType
        event.thumbnail = imgUrl || event.thumbnail
        await event.save()

        return res.status(200).json({ message: AppConfig.STRINGS.Success, event })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const deleteEventController: RequestHandler = async (req: any, res) => {
    try {
        const event = await EventModel.findById(req.params.id)
        if (!event) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound })
        }
        if (event.business._id.toString() !== req.user.business?._id.toString()) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound })
        }
        await event.deleteOne()
        return res.status(200).json({ message: AppConfig.STRINGS.Success })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const saveEventController: RequestHandler = async (req: any, res) => {
    try {
        const event = await EventModel.findById(req.params.id)
        if (!event) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound })
        }
        if (event.saves.filter(x => x.toString() === req.user.id.toString()).length > 0) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.AlreadySaved })
        }
        event.saves.push(req.user)
        await event.save()
        const data: any = event.toJSON()
        delete data.saves
        delete data.applicants

        return res.status(200).json({ message: AppConfig.STRINGS.Success, event: data })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const getEventController: RequestHandler = async (req: any, res) => {
    try {
        const event = await EventModel.findById(req.params.id).populate('business')
        return res.status(200).json({ message: AppConfig.STRINGS.Success, event })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const getEventsController: RequestHandler = async (req: any, res) => {
    try {
        let events;
        if (req.query.businessId) {
            events = await EventModel.find({ business: req.query.businessId }).populate('business')
        } else {
            events = await EventModel.find({}).populate('business')
        }
        const data = paginateData(req.query, events, 'events')
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const getMyEventsController: RequestHandler = async (req: any, res) => {
    try {
        const business = req.user.business
        const events = await EventModel.find({ business }).populate('business saves')
        const data = paginateData(req.query, events, 'events')
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const getSavedEventsController: RequestHandler = async (req: any, res) => {
    try {
        const events = await EventModel.find({ 'saves': req.user.id }).select('-saves')
        const data = paginateData(req.query, events, 'events')
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ error })
    }
}