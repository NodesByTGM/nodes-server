import { RequestHandler } from 'express';
import { AccountModel, BusinessModel, TalentDetailsModel } from '../mongodb/models';
import { uploadMedia } from '../services';
import { AppConfig } from '../utilities/config';
import { Schema } from 'mongoose';

export const profileController: RequestHandler = async (req: any, res: any) => {
    // res.json({ message: `Welcome ${req.user.username}` });
    try {
        const user = req.user
        const talentProfile = await TalentDetailsModel.findOne({ accountId: req.user.id })
        const businessProfile = await BusinessModel.findOne({ accountId: req.user.id })
        const data = {
            ...user.toJSON(),
            talentProfile,
            businessProfile

        }
        return res.json({ user: data });
    } catch (error) {
        return res.json({ error: JSON.stringify(error) })
    }
};

export const profileUpdateController: RequestHandler = async (req: any, res: any) => {
    // res.json({ message: `Welcome ${req.user.username}` });
    console.log(req.body)
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
            const r = await user.save()
            const data = {
                ...r.toJSON(),
                business

            }
            return res.json({ user: data });
        }
        return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError });

    } catch (error) {
        return res.status(500).json({ error: JSON.stringify(error) })
    }
};

export const allUsersContoller: RequestHandler = async (req, res) => {
    try {
        const users = await AccountModel.find()
        for (let user of users) {
            if (user.business) {
                const business = await BusinessModel.findOne({ account: user.id })
                if (business) {
                    // user.business = null
                    // await user.save()

                    // user.business = business.id
                    user.type = AppConfig.ACCOUNT_TYPES.BUSINESS
                    console.log("user.business", user.business)
                    await user.save()
                }
            }
        }
        return res.json({ message: users });
    } catch (error) {
        return res.json({ error: JSON.stringify(error) })
    }
};

