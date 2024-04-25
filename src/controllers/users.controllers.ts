import { RequestHandler } from 'express';
import { AccountModel, BusinessModel, ConnectionRequestModel, ProjectModel } from '../mongodb/models';
import { EventsService, JobsService, constructResponse, uploadMedia } from '../services';
import { AppConfig } from '../utilities/config';
import { paginateData } from '../utilities/common';
import { Types } from 'mongoose';


const getAllUsers: RequestHandler = async (req: any, res) => {
    try {
        const { skills, name, connections } = req.query;
        const userId = req.user.id.toString()
        // Construct base query
        let query: any = {};

        // Add filters based on parameters
        if (skills) {
            query.skills = { $regex: skills, $options: 'i' }; // Case-insensitive search for text
        }
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const connectionRequests = await ConnectionRequestModel.find({
            sender: userId,
        }).lean();
        // Get IDs of users with pending connection requests
        const requestedUserIds = connectionRequests.map(request => request.recipient);

        const accounts = await AccountModel.aggregate([
            { $match: query },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    connected: { $in: [userId, "$connections"] },
                    requested: { $in: ["$_id", requestedUserIds] }
                }
            },

            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v", "subscription", "password", "firebaseToken"] },
        ]);

        await AccountModel.populate(accounts, [
            { path: 'connections', select: 'id name email type headline bio avatar' },
        ]);

        const data = paginateData(req.query, accounts, 'accounts')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.CommunityAccount
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.CommunityAccount
        })
    }
}

const getUserProfile: RequestHandler = async (req: any, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.BadRequestError,
                apiObject: AppConfig.API_OBJECTS.SingleCommunityAccount
            })
        }
        const user = await AccountModel.findById(req.params.id)
        if (!user) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.SingleCommunityAccount
            })
        }
        const connectionRequests = await ConnectionRequestModel.find({
            sender: req.user.id,
        }).lean();

        await AccountModel.populate(user, [
            { path: 'connections', select: 'id name email type headline bio avatar' },
        ]);

        const { subscription, connections, firebaseToken, ...rest } = user.toJSON()
        const data: any = { ...rest, connections, requested: false, connected: false, projects: [], events: [], jobs: [] }
        if (connectionRequests.filter(x => x.recipient.toString() === user.id.toString()).length > 0) {
            data.requested = true
        }
        if (data.connections.filter((x: any) => x.toString() === user.id.toString()).length > 0) {
            data.connected = true
        }

        const projects = await ProjectModel.find({ owner: user.id })
        const jobs = await JobsService.getUserJobs(user, req.user);
        const events = await EventsService.getUserEvents(user, req.user)
        data.projects = projects
        data.jobs = jobs
        data.events = events

        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.SingleCommunityAccount
        })
    } catch (error) {
        console.log(error)
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.SingleCommunityAccount
        })
    }
}

const getProfile: RequestHandler = async (req: any, res: any) => {
    try {
        const user = req.user
        await AccountModel.populate(user, [
            { path: 'connections', select: 'id name email type headline bio avatar' },
        ]);
        return constructResponse({
            res,
            code: 200,
            data: user,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Account
        })
    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Account
        })
    }
};

const updateProfile: RequestHandler = async (req: any, res: any) => {
    try {
        const {
            name,
            avatar,
            skills,
            location,
            linkedIn,
            instagram,
            twitter,
            headline,
            bio,
            website,
            spaces,
            comments,
            visible,
            height,
            age,
            firebaseToken,
        } = req.body

        const uploadedAvatar = await uploadMedia(avatar)

        const user = await AccountModel.findById(req.user.id)
        if (user) {
            user.name = name || user.name
            user.avatar = uploadedAvatar || user.avatar
            user.skills = skills || user.skills
            user.location = location || user.location
            user.linkedIn = linkedIn || user.linkedIn
            user.instagram = instagram || user.instagram
            user.twitter = twitter || user.twitter
            user.headline = headline || user.headline
            user.bio = bio || user.bio
            user.website = website || user.website
            user.firebaseToken = firebaseToken || user.firebaseToken

            user.height = height || user.height
            user.age = age || user.age

            user.spaces = spaces !== undefined ? spaces : user.spaces
            user.comments = comments !== undefined ? comments : user.comments
            user.visible = visible !== undefined ? visible : user.visible
            const account = await user.save()

            return constructResponse({
                res,
                code: 200,
                data: account,
                message: AppConfig.STRINGS.ProfileUpdateSuccessful,
                apiObject: AppConfig.API_OBJECTS.Account
            })
        }
        return constructResponse({
            res,
            code: 400,
            message: AppConfig.ERROR_MESSAGES.BadRequestError,
            apiObject: AppConfig.API_OBJECTS.Account
        })

    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Account
        })
    }
};

const updateBusinessProfile: RequestHandler = async (req: any, res) => {
    try {
        const {
            name,
            logo,
            yoe,
            location,
            linkedIn,
            instagram,
            twitter,
            headline,
            bio
        } = req.body
        let business
        if (req.user.type === AppConfig.ACCOUNT_TYPES.BUSINESS) {
            business = await BusinessModel.findOne({ account: req.user.id })
            const uploadedLogo = await uploadMedia(logo)
            if (business) {
                business.name = name || business.name
                business.logo = uploadedLogo || business.logo
                business.yoe = yoe || business.yoe
                business.location = location || business.location
                business.linkedIn = linkedIn || business.linkedIn
                business.instagram = instagram || business.instagram
                business.twitter = twitter || business.twitter
                business.headline = headline || business.headline
                business.bio = bio || business.bio
                await business.save()
                business = business.toJSON()
            } else {
                business = await BusinessModel.create({
                    name,
                    yoe,
                    bio,
                    headline,
                    location,
                    linkedIn,
                    instagram,
                    twitter,
                    logo: uploadedLogo,
                    account: req.user.id
                })
                req.user.business = business.id
                await req.user.save()
            }
        }
        const user = await AccountModel.findById(req.user.id)
        return constructResponse({
            res,
            code: 200,
            data: user,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Account
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Account
        })
    }

}

const requestConnection: RequestHandler = async (req: any, res) => {
    try {
        if (req.params.id === req.user.id) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.CantConnectYourself,
                apiObject: AppConfig.API_OBJECTS.CommunityAccount
            })
        }
        const recipient = await AccountModel.findById(req.params.id)
        if (!recipient) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.CommunityAccount
            })
        }
        const request = await ConnectionRequestModel.findOne({ sender: req.user.id, recipient: recipient.id })

        if (request) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.AlreadyRequestedConnection,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        await ConnectionRequestModel.create({
            sender: req.user,
            recipient: recipient,
            message: req.body.message || ''
        })
        await AccountModel.populate(recipient, [
            { path: 'connections', select: 'id name email type headline bio avatar' },
        ]);

        const { subscription, connections, firebaseToken, ...rest } = recipient.toJSON()
        const data = { recipient: { ...rest, connections, requested: false, connected: false }, request }
        data.recipient.requested = true
        data.recipient.connected = false
        return constructResponse({
            res,
            code: 201,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.CommunityAccount
        })
    } catch (error) {

        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.CommunityAccount
        })
    }
}

const acceptRequest: RequestHandler = async (req: any, res) => {
    try {
        const request = await ConnectionRequestModel.findById(req.params.id)
        const recipient = req.user
        if (!request || request.recipient.id !== recipient.id) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.ConnectionRequest
            })
        }
        const sender = await AccountModel.findById(request.sender.id)

        if (!sender) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.Account
            })
        }

        // if (sender.connections.filter(x => x.toString() === recipient.id.toString()).length > 0) {
        //     return constructResponse({
        //         res,
        //         code: 400,
        //         message: AppConfig.ERROR_MESSAGES.AlreadyConnected,
        //         apiObject: AppConfig.API_OBJECTS.ConnectionRequest
        //     })
        // }
        if (sender.connections.filter((x: any) => x.toString() === recipient.id.toString()).length === 0) {
            sender.connections.push(recipient)
            await sender.save()
        }
        if (recipient.connections.filter((x: any) => x.toString() === sender.id.toString()).length > 0) {
            recipient.connections.push(sender)
            await recipient.save()
        }
        

        // request.status = AppConfig.CONNECTION_REQUEST_STATUS.Accepted
        // await request.save()
        await request.deleteOne()
        await AccountModel.populate(sender, [
            { path: 'connections', select: 'id name email type headline bio avatar' },
        ]);

        const { subscription, connections, firebaseToken, ...rest } = sender.toJSON()
        const data = { sender: { ...rest, connections, requested: false, connected: false }, request: null }
        data.sender.requested = false
        data.sender.connected = true
        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.ConnectionRequest
        })
    } catch (error) {

        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.ConnectionRequest
        })
    }
}

const rejectRequest: RequestHandler = async (req: any, res) => {
    try {
        const request = await ConnectionRequestModel.findById(req.params.id)
        if (!request || request.recipient.id !== req.user.id) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.ConnectionRequest
            })
        }
        request.status = AppConfig.CONNECTION_REQUEST_STATUS.Rejected
        await request.save()
        // await request.deleteOne()
        const sender: any = await AccountModel.findById(request.sender)
        await AccountModel.populate(sender, [
            { path: 'connections', select: 'id name email type headline bio avatar' },
        ]);

        const { subscription, connections, firebaseToken, ...rest } = sender.toJSON()
        const data = { sender: { ...rest, connections, requested: false, connected: false }, request }
        data.sender.requested = true
        data.sender.connected = false

        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.CommunityAccount
        })
    } catch (error) {

        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.CommunityAccount
        })
    }
}

const abandonRequest: RequestHandler = async (req: any, res) => {
    try {
        const request = await ConnectionRequestModel.findById(req.params.id)
        if (!request || request.recipient.id !== req.user.id) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.ConnectionRequest
            })
        }
        request.status = AppConfig.CONNECTION_REQUEST_STATUS.Abandoned
        await request.save()
        // await request.deleteOne()

        const sender: any = await AccountModel.findById(request.sender)
        await AccountModel.populate(sender, [
            { path: 'connections', select: 'id name email type headline bio avatar' },
        ]);

        const { subscription, connections, firebaseToken, ...rest } = sender.toJSON()
        const data = { sender: { ...rest, connections, requested: false, connected: false }, request }
        data.sender.requested = true
        data.sender.connected = false

        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.CommunityAccount
        })
    } catch (error) {

        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.CommunityAccount
        })
    }
}

const removeConnection: RequestHandler = async (req: any, res) => {
    try {
        const user: any = await AccountModel.findById(req.params.id)
        if (!user) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.Account
            })
        }

        if (user.connections.filter((x: any) => x.toString() === req.user.id.toString()).length > 0) {
            user.connections = user.connections.filter((x: any) => x.toString() !== req.user.id.toString())
            await user.save()
        }
        if (req.user.connections.filter((x: any) => x.toString() === user.id.toString()).length > 0) {
            req.user.connections = req.user.connections.filter((x: any) => x.toString() !== user.id.toString())
            await req.user.save()
        }

        // req.user.connections = []
        // user.connections = []

        await user.save()
        await req.user.save()


        // await ConnectionRequestModel.deleteOne({
        //     $or: [
        //         { sender: req.user.id, recipient: user.id },
        //         { recipient: req.user.id, sender: user.id }
        //     ]
        // })

        await AccountModel.populate(user, [
            { path: 'connections', select: 'id name email type headline bio avatar' },
        ]);


        const { subscription, connections, firebaseToken, ...rest } = user.toJSON()
        const data = { sender: { ...rest, connections, requested: false, connected: false }, request: null }
        data.sender.requested = false
        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.CommunityAccount
        })
    } catch (error) {

        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.CommunityAccount
        })
    }
}

const getConnectionRequests: RequestHandler = async (req: any, res: any) => {
    try {
        const requests = await ConnectionRequestModel.find({
            $or: [
                { sender: req.user.id },
                { recipient: req.user.id }
            ]
        })
        await ConnectionRequestModel.populate(requests, [
            { path: 'sender', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
            { path: 'recipient', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
        ]);

        const data = paginateData(req.query, requests, 'requests')
        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.ConnectionRequest
        })
    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.ConnectionRequest
        })
    }
};


const getUserConnections: RequestHandler = async (req: any, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.BadRequestError,
                apiObject: AppConfig.API_OBJECTS.Connections
            })
        }
        const user = await AccountModel.findById(req.params.id)
        if (!user) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.Connections
            })
        }

        await AccountModel.populate(user, [
            { path: 'connections', select: 'id name email type headline bio avatar' },
        ]);
        const data = paginateData(req.query, user.connections, 'connections')
        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Connections
        })
    } catch (error) {
        console.log(error)
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Connections
        })
    }
}


const getProfileConnections: RequestHandler = async (req: any, res) => {
    try {
        const user = await AccountModel.findById(req.user.id)
        if (!user) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.Connections
            })
        }

        await AccountModel.populate(user, [
            { path: 'connections', select: 'id name email type headline bio avatar' },
        ]);
        const data = paginateData(req.query, user.connections, 'connections')
        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Connections
        })
    } catch (error) {
        console.log(error)
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Connections
        })
    }
}


export default {
    getProfile,
    updateProfile,
    updateBusinessProfile,
    getAllUsers,
    getUserProfile,
    requestConnection,
    acceptRequest,
    rejectRequest,
    abandonRequest,
    removeConnection,
    getConnectionRequests,
    getUserConnections,
    getProfileConnections
}
