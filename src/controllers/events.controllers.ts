import { RequestHandler } from "express";
import { AccountModel, EventModel, NotificationModel } from "../mongodb/models";
import { constructResponse, uploadMedia } from "../services";
import { paginateData } from "../utilities/common";
import { AppConfig } from "../utilities/config";

const createEvent: RequestHandler = async (req: any, res) => {
    try {
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

const updateEvent: RequestHandler = async (req: any, res) => {
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
            { path: 'thumbnail' },
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

const deleteEvent: RequestHandler = async (req: any, res) => {
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

const saveEvent: RequestHandler = async (req: any, res) => {
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
        data.saved = true
        data.saves = event.business === req.user.business ? event.saves : event.saves.length
        data.registered = event.attendees.map(y => y.id.toString()).includes(req.user.id)
        data.attendees = event.business === req.user.business ? event.attendees : event.attendees.length

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

const unsaveEvent: RequestHandler = async (req: any, res) => {
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
        data.saved = false
        data.saves = event.business === req.user.business ? event.saves : event.saves.length
        data.registered = event.attendees.map(y => y.id.toString()).includes(req.user.id)
        data.attendees = event.business === req.user.business ? event.attendees : event.attendees.length

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

const registerToEvent: RequestHandler = async (req: any, res) => {
    try {
        let event = await EventModel.findById(req.params.id)
        if (!event) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        if (event.attendees.filter(x => x.toString() === req.user._id.toString()).length > 0) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.AlreadyApplied,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        event.attendees.push(req.user)
        await event.save()

        const owner = await AccountModel.find({ business: event.business })
        if (owner) {
            await NotificationModel.create({
                account: owner,
                message: `${req.user.name} just registered for ${event.name} `,
                foreignKey: req.user.id.toString(),
                type: AppConfig.NOTIFICATION_TYPES.EVENT_REGISTRATION,
            })
        }

        const data: any = event.toJSON()
        data.saved = event.saves.map(x => x.id).includes(req.user.id)
        data.saves = event.business === req.user.business ? event.saves : event.saves.length
        data.registered = event.attendees.map(y => y.id.toString()).includes(req.user.id)
        data.attendees = event.business === req.user.business ? event.attendees : event.attendees.length

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

const getEvent: RequestHandler = async (req: any, res) => {
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
            registered: event.attendees.map(y => y.id.toString()).includes(req.user.id),
            saves: event.business === req.user.business ? event.saves : event.saves.length,
            attendees: event.business === req.user.business ? event.attendees : event.attendees.length
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

const getEvents: RequestHandler = async (req: any, res) => {
    try {
        const userId = req.user.id.toString()

        const events = await EventModel.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    saved: { $in: [userId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }] },
                    registered: { $in: [userId, { $map: { input: "$attendees", as: "registered", in: { $toString: "$$registered" } } }] },
                }
            },
            { $addFields: { saves: { $size: '$saves' }, attendees: { $size: '$attendees' } } },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] }
        ]);
        await EventModel.populate(events, [
            { path: 'business' },
            { path: 'thumbnail' },
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

const getMyEvents: RequestHandler = async (req: any, res) => {
    try {
        const business = req.user.business
        const userId = req.user.id.toString()
        const events = await EventModel.aggregate([
            { $match: { business: business._id } },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    saved: { $in: [userId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }] },
                    registered: { $in: [userId, { $map: { input: "$attendees", as: "registered", in: { $toString: "$$registered" } } }] },
                }
            },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] }
        ]);
        await EventModel.populate(events, [
            { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
            { path: 'thumbnail' },
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

const getSavedEvents: RequestHandler = async (req: any, res) => {
    try {
        const userId = req.user.id.toString()
        const events = await EventModel.aggregate([
            { $match: { saves: req.user._id } },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    saved: { $in: [userId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }] },
                    registered: { $in: [userId, { $map: { input: "$attendees", as: "registered", in: { $toString: "$$registered" } } }] },
                }
            },
            { $addFields: { saves: { $size: '$saves' }, attendees: { $size: '$attendees' } } },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] }
        ]);
        await EventModel.populate(events, [
            // { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
            { path: 'thumbnail' },
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

const getRegisteredEvents: RequestHandler = async (req: any, res) => {
    try {
        const userId = req.user.id.toString()
        const events = await EventModel.aggregate([
            { $match: { attendees: req.user._id } },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    saved: { $in: [userId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }] },
                    registered: { $in: [userId, { $map: { input: "$attendees", as: "registered", in: { $toString: "$$registered" } } }] },
                }
            },
            { $addFields: { saves: { $size: '$saves' }, attendees: { $size: '$attendees' } } },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] }
        ]);
        await EventModel.populate(events, [
            // { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'business' },
            { path: 'thumbnail' },
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
    getSavedEvents,
    getRegisteredEvents,
    registerToEvent
}