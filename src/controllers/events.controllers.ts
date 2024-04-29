import { RequestHandler } from "express";
import { BusinessModel, EventModel } from "../mongodb/models";
import { constructResponse, uploadMedia } from "../services";
import { paginateData } from "../utilities/common";
import { AppConfig } from "../utilities/config";

export const createEvent: RequestHandler = async (req: any, res) => {
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
        return constructResponse({
            res,
            data: event,
            code: 201,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    }
}

export const updateEvent: RequestHandler = async (req: any, res) => {
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
            return constructResponse({
                res,
                data: event,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        if (event.business._id.toString() !== req.user.business?._id.toString()) {
            return constructResponse({
                res,
                data: event,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.UnauthorizedAccess,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        const imgUrl = await uploadMedia(thumbnail)

        event.name = name || event.name
        event.description = description || event.description
        event.location = location || event.location
        event.dateTime = dateTime || event.dateTime
        event.paymentType = paymentType || event.paymentType
        event.thumbnail = imgUrl || event.thumbnail
        await event.save()

        await EventModel.populate(event, [
            { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
        ]);
        return constructResponse({
            res,
            data: event,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    }
}

export const deleteEvent: RequestHandler = async (req: any, res) => {
    try {
        const event = await EventModel.findById(req.params.id)
        if (!event) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        if (event.business._id.toString() !== req.user.business?._id.toString()) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        await event.deleteOne()
        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    }
}

export const saveEvent: RequestHandler = async (req: any, res) => {
    try {
        const event = await EventModel.findById(req.params.id)
        if (!event) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        if (event.saves.filter(x => x.id.toString() === req.user.id.toString()).length > 0) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.AlreadySaved,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        event.saves.push(req.user)
        await event.save()
        const data: any = event.toJSON()
        data.saves = event.saves.length
        data.saved = true

        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    }
}

export const unsaveEvent: RequestHandler = async (req: any, res) => {
    try {
        const event = await EventModel.findById(req.params.id)
        if (!event) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        if (event.saves.filter(x => x.id.toString() === req.user.id.toString()).length > 0) {
            event.saves = event.saves.filter(x => x.id.toString() !== req.user.id.toString())
            await event.save()
        }
        const data: any = event.toJSON()
        data.saves = event.saves.length
        data.saved = false

        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    }
}

export const getEvent: RequestHandler = async (req: any, res) => {
    try {
        const event = await EventModel.findById(req.params.id).populate('business')
        if (!event) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        const data = {
            ...event?.toJSON(),
            saved: event.saves.map(y => y.id.toString()).includes(req.user.id),
            saves: event.business === req.user.business ? event.saves : event.saves.length
        }
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    }
}

export const getEvents: RequestHandler = async (req: any, res) => {
    try {
        const userId = req.user.id.toString()
        // TODO HIDE BASED ON OWNER
        const events = await EventModel.aggregate([
            // { $match: { saves: req.user._id } },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    saved: {
                        $in: [userId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }]
                    }
                }
            },
            { $addFields: { saves: { $size: '$saves' } } },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] }
        ]);
        await EventModel.populate(events, [
            // { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
        ]);
        const data = paginateData(req.query, events, 'events')

        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    }
}

export const getMyEvents: RequestHandler = async (req: any, res) => {
    try {
        const business = req.user.business
        const userId = req.user.id.toString()
        // TODO HIDE BASED ON OWNER
        const events = await EventModel.aggregate([
            { $match: { business: business._id } },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    saved: {
                        $in: [userId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }]
                    }
                }
            },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] }
        ]);
        await EventModel.populate(events, [
            { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
        ]);
        const data = paginateData(req.query, events, 'events')

        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    }
}

export const getSavedEvents: RequestHandler = async (req: any, res) => {
    try {
        const userId = req.user.id.toString()
        // TODO HIDE BASED ON OWNER
        const events = await EventModel.aggregate([
            { $match: { saves: req.user._id } },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    saved: {
                        $in: [userId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }]
                    }
                }
            },
            { $addFields: { saves: { $size: '$saves' } } },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] }
        ]);
        await EventModel.populate(events, [
            // { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
        ]);
        const data = paginateData(req.query, events, 'events')

        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    }
}

export default {
    createEvent,
    updateEvent,
    deleteEvent,
    saveEvent,
    unsaveEvent,
    getEvents,
    getEvent,
    getMyEvents,
    getSavedEvents
}