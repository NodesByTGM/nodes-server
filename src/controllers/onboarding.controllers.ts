import { RequestHandler } from "express";
import { AppConfig } from "../utilities/config";
import { businessUpgradeSchema, talentUpgradeSchema } from "../validations/upgrades.validations";
import { BusinessDetailsModel, TalentDetailsModel } from "../mongodb/models";
import { uploadMedia } from "../services";


export const talentOnboardingController: RequestHandler = async (req: any, res) => {
    const { error } = talentUpgradeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
        skills,
        location,
        avatar,
        linkedIn,
        instagram,
        twitter,
        onboardingPurpose,
        step
    } = req.body;
    try {
        const { user } = req
        let talentProfile = await TalentDetailsModel.findOne({ account: req.user.id, })
        if (!user.verified) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.UnverifiedEmail });
        }
        // if ((user.type === AppConfig.ACCOUNT_TYPES.TALENT) && dbTalent) {
        //     return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError });
        // }
        if (talentProfile) {
            talentProfile.skills = skills || talentProfile.skills,
            talentProfile.location = location || talentProfile.location,
            talentProfile.linkedIn = linkedIn || talentProfile.linkedIn,
            talentProfile.instagram = instagram || talentProfile.instagram,
            talentProfile.twitter = twitter || talentProfile.twitter,
            talentProfile.onboardingPurpose = onboardingPurpose || talentProfile.onboardingPurpose,
            talentProfile.step = step || talentProfile
        } else {
            talentProfile = await TalentDetailsModel.create({
                accountId: req.user.id,
                skills,
                location,
                linkedIn,
                instagram,
                twitter,
                onboardingPurpose,
                step
            })
        }

        user.type = AppConfig.ACCOUNT_TYPES.TALENT
        user.avatar = avatar || user.avatar
        await user.save()

        const data = {
            ...user.toJSON(),
            talentProfile
        }

        return res.status(200).json({ message: AppConfig.STRINGS.AccountUpgradedTalent, user:data });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};

export const businessOnboardingController: RequestHandler = async (req: any, res) => {
    const { error } = businessUpgradeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
        companyName,
        avatar,
        logo,
        website,
        location,
        industry,
        tagline,
        size,
        type,
        linkedIn,
        instagram,
        twitter,
        profession } = req.body;
    try {
        const { user } = req
        const dbTalent = await TalentDetailsModel.findOne({ account: req.user.id, })
        if (!user.verified) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.UnverifiedEmail });
        }
        if ((user.type === AppConfig.ACCOUNT_TYPES.TALENT) && dbTalent) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError });
        }

        const logoUrl = await uploadMedia(logo)
        const avatarUrl = await uploadMedia(avatar)

        const talent = await BusinessDetailsModel.create({
            accountId: req.user.id,
            name: companyName,
            logo: logoUrl,
            website,
            location,
            industry,
            tagline,
            size,
            type,
            linkedIn,
            instagram,
            twitter,
            profession
        })


        user.type = AppConfig.ACCOUNT_TYPES.BUSINESS
        user.avatar = avatarUrl

        await user.save()

        return res.status(200).json({ message: AppConfig.STRINGS.AccountUpgradedBusiness, data: talent });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};
