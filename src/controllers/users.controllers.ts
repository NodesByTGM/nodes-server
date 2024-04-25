import { RequestHandler } from 'express';
import { AccountModel, BusinessModel, ConnectionRequestModel } from '../mongodb/models';
import { constructResponse, uploadMedia } from '../services';
import { AppConfig } from '../utilities/config';
import { paginateData } from '../utilities/common';


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
                $project: {
                    name: "$name",
                    avatar: "$avatar",
                    headline: "$headline",
                    bio: "$bio",
                    email: "$email",
                    id: "$_id",
                    type: "$type"
                }
            },
            {
                $addFields: {
                    connected: {
                        $in: [userId, { $map: { input: "$connections", as: "connected", in: { $toString: "$$connected" } } }]
                    }
                }
            },
            {
                $addFields: {
                    requested: { $in: ["$_id", requestedUserIds] }
                }
            },

            // { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] },
        ]);

        const data = paginateData(req.query, accounts, 'accounts')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    }
}

const getUserProfile: RequestHandler = async (req: any, res) => {
    try {
        const user = await AccountModel.findById(req.params.id)
        if (!user) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.CommunityAccount
            })
        }
        const connectionRequests = await ConnectionRequestModel.find({
            sender: req.user.id,
        }).lean();

        await AccountModel.populate(user, [
            { path: 'connections', select: 'name email id avatar type headline bio email', options: { autopopulate: false } },
        ]);
        const { name, id, avatar, type, headline, bio, email, connections } = user
        const data = { name, id, avatar, type, connections, requested: false }
        if (connectionRequests.filter(x => x.recipient.toString() === user.id.toString()))
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

const getProfile: RequestHandler = async (req: any, res: any) => {
    try {
        const user = req.user
        await AccountModel.populate(user, [
            { path: 'connections', select: 'name email id avatar type headline bio email', options: { autopopulate: false } },
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
        const user = await AccountModel.findById(req.params.id)
        if (!user) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.CommunityAccount
            })
        }
        const request = await ConnectionRequestModel.findOne({ sender: req.user.id, recipient: user.id })

        if (request) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.AlreadyRequestedConnection,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
        await ConnectionRequestModel.create({
            sender: req.user.id,
            recipient: user.id,
            message: req.body.message || ''
        })
        await AccountModel.populate(user, [
            { path: 'connections', select: 'name email id avatar type headline bio email', options: { autopopulate: false } },
        ]);

        const { name, id, avatar, type, headline, bio, email, connections } = user
        const data: any = { name, id, avatar, type, headline, bio, email, connections }
        data.requested = true
        data.connected = false
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
        if (!request) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.ConnectionRequest
            })
        }
        const user = await AccountModel.findById(request.sender.id)

        if (!user) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.Account
            })
        }

        if (user.connections.filter(x => x.toString() === request.sender.toString()).length > 0) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.AlreadyConnected,
                apiObject: AppConfig.API_OBJECTS.ConnectionRequest
            })
        }
        user.connections.push(req.user)
        req.user.connections.push(user)
        await user.save()
        await req.user.save()
        request.status = AppConfig.CONNECTION_REQUEST_STATUS.Accepted
        await request.save()
        await AccountModel.populate(user, [
            { path: 'connections', select: 'name email id avatar type headline bio email', options: { autopopulate: false } },
        ]);

        const { name, id, avatar, type, headline, bio, email, connections } = user
        const data: any = { name, id, avatar, type, headline, bio, email, connections }
        data.requested = true
        data.connected = true
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

const rejectRequest: RequestHandler = async (req: any, res) => {
    try {
        const request = await ConnectionRequestModel.findById(req.params.id)
        if (!request) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.ConnectionRequest
            })
        }
        request.status === AppConfig.CONNECTION_REQUEST_STATUS.Rejected
        await request.save()
        // await request.deleteOne()
        const user: any = await AccountModel.findById(request.sender)
        await AccountModel.populate(user, [
            { path: 'connections', select: 'name email id avatar type headline bio email', options: { autopopulate: false } },
        ]);

        const { name, id, avatar, type, headline, bio, email, connections } = user
        const data: any = { name, id, avatar, type, headline, bio, email, connections }
        data.requested = true
        data.connected = false

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
        if (!request) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.ConnectionRequest
            })
        }
        request.status === AppConfig.CONNECTION_REQUEST_STATUS.Abandoned
        await request.save()
        // await request.deleteOne()

        const user: any = await AccountModel.findById(request.sender)
        await AccountModel.populate(user, [
            { path: 'connections', select: 'name email id avatar type headline bio email', options: { autopopulate: false } },
        ]);

        const { name, id, avatar, type, headline, bio, email, connections } = user
        const data: any = { name, id, avatar, type, headline, bio, email, connections }
        data.requested = true
        data.connected = false

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

        user.connections.push(req.user)
        req.user.connections.push(user)
        await user.save()
        await req.user.save()


        await ConnectionRequestModel.deleteOne({
            $or: [
                { sender: req.user.id, recipient: user.id },
                { recipient: req.user.id, sender: user.id }
            ]
        })

        await AccountModel.populate(user, [
            { path: 'connections', select: 'name email id avatar type headline bio email', options: { autopopulate: false } },
        ]);


        const { name, id, avatar, type, headline, bio, email, connections } = user
        const data: any = { name, id, avatar, type, headline, bio, email, connections }
        data.requested = false
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
            { path: 'sender', select: 'name email id avatar type headline bio email', options: { autopopulate: false } },
            { path: 'recipient', select: 'name email id avatar type headline bio email', options: { autopopulate: false } },
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
    getConnectionRequests
}
