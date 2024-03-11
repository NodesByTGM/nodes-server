import { RequestHandler } from 'express';
import { AccountModel, BusinessDetailsModel, TalentDetailsModel } from '../mongodb/models';
import { uploadMedia } from '../services';
import { AppConfig } from '../utilities/config';

export const profileController: RequestHandler = async (req: any, res: any) => {
    // res.json({ message: `Welcome ${req.user.username}` });
    try {
        const user = req.user
        const talentProfile = await TalentDetailsModel.findOne({ accountId: req.user.id })
        const businessProfile = await BusinessDetailsModel.findOne({ accountId: req.user.id })
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
            logo,
            companyName,
            yoe,
        } = req.body

        const uploadedAvatar = await uploadMedia(avatar)

        const user = await AccountModel.findById(req.user.id)
        if (user) {
            user.name = name || user.name
            user.avatar = uploadedAvatar || user.avatar
            user.skills = skills || skills
            user.location = location || location
            user.linkedIn = linkedIn || linkedIn
            user.instagram = instagram || instagram
            user.twitter = twitter || twitter
            user.headline = headline || headline
            user.bio = bio || bio
            user.website = website || website
            user.spaces = spaces || spaces
            user.comments = comments || comments

            let businessProfile
            if (user.type === AppConfig.ACCOUNT_TYPES.BUSINESS) {
                businessProfile = await BusinessDetailsModel.findOne({ accountId: req.user.id })
                const uploadedLogo = await uploadMedia(logo)
                if (businessProfile) {
                    businessProfile.name = companyName || businessProfile.name
                    businessProfile.logo = uploadedLogo || businessProfile.logo
                    businessProfile.yoe = yoe || businessProfile.yoe
                    await businessProfile.save()
                    businessProfile = businessProfile.toJSON()
                }
            }
            await user.save()
            const data = {
                ...user.toJSON(),
                businessProfile

            }
            return res.json({ user: data });
        }
        return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError });

    } catch (error) {
        return res.json({ error: JSON.stringify(error) })
    }
};

export const allUsersContoller: RequestHandler = async (req, res) => {
    try {
        const users = await AccountModel.find({}, { password: 0 })
        return res.json({ message: users });
    } catch (error) {
        return res.json({ error: JSON.stringify(error) })
    }
};

