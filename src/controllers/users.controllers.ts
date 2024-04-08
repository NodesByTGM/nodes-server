import { RequestHandler } from 'express';
import { AccountModel, BusinessModel } from '../mongodb/models';
import { constructResponse, uploadMedia } from '../services';
import { AppConfig } from '../utilities/config';

export const profileController: RequestHandler = async (req: any, res: any) => {
    try {
        const user = req.user
        const business = await BusinessModel.findOne({ accountId: req.user.id })
        const data = {
            ...user.toJSON(),
            business

        }
        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Media
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

export const profileUpdateController: RequestHandler = async (req: any, res: any) => {
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
            logo,
            companyName,

            height,
            age,
            yoe,
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

            user.height = height || user.height
            user.age = age || user.age

            user.spaces = spaces !== undefined ? spaces : user.spaces
            user.comments = comments !== undefined ? comments : user.comments
            user.visible = visible !== undefined ? visible : user.visible


            let business
            if (user.type === AppConfig.ACCOUNT_TYPES.BUSINESS) {
                business = await BusinessModel.findOne({ account: req.user.id })
                const uploadedLogo = await uploadMedia(logo)
                if (business) {
                    business.name = companyName || business.name
                    business.logo = uploadedLogo || business.logo
                    business.yoe = yoe || business.yoe
                    await business.save()
                    business = business.toJSON()
                }
            }
            const account = await user.save()
            const data = { ...account.toJSON(), business }

            return constructResponse({
                res,
                code: 200,
                data,
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

export const allUsersContoller: RequestHandler = async (req, res) => {
    try {
        const users = await AccountModel.find().select('name username id avatar')

        // await AccountModel.populate(users, [
        //     { path: 'author', select: 'name id avatar', options: { autopopulate: false } },
        //     { path: 'likes', select: 'name id avatar', options: { autopopulate: false } },
        //     { path: 'comments' },
        // ]);
        return constructResponse({
            res,
            code: 200,
            data: users,
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
};

