import { RequestHandler } from 'express';
import { AccountModel, BusinessModel } from '../mongodb/models';
import { constructResponse, uploadMedia } from '../services';
import { AppConfig } from '../utilities/config';
import { paginateData } from '../utilities/common';


const getAllUsers: RequestHandler = async (req: any, res) => {
    try {
        const { skills, name, connections } = req.query;

        // Construct base query
        let query: any = {};

        // Add filters based on parameters
        if (skills) {
            query.skills = { $regex: skills, $options: 'i' }; // Case-insensitive search for text
        }
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const accounts = await AccountModel.aggregate([
            { $match: query },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    name: "$name",
                    username: "$username",
                    avatar: "$avatar",
                    headline: "$headline",
                    bio: "$bio",
                    email: "$email",
                    id: "$_id",
                    type: "$type"
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
        const data = await AccountModel.findById(req.params.id)
        if (!data) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.MiniAccount
            })
        }
        const { name, id, avatar, type } = data
        return constructResponse({
            res,
            code: 200,
            data: { name, id, avatar, type },
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.MiniAccount
        })
    } catch (error) {

        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.MiniAccount
        })
    }
}

const getProfile: RequestHandler = async (req: any, res: any) => {
    try {
        const user = req.user
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


export default {
    getProfile,
    updateProfile,
    updateBusinessProfile,
    getAllUsers,
    getUserProfile,
}
