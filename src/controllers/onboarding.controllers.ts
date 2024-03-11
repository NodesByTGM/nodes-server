import { RequestHandler } from "express";
import { BusinessDetailsModel, TalentDetailsModel } from "../mongodb/models";
import { uploadMedia } from "../services";
import { AppConfig } from "../utilities/config";
import { talentUpgradeSchema } from "../validations/upgrades.validations";


export const onboardingController: RequestHandler = async (req: any, res) => {
    // const { error } = talentUpgradeSchema.validate(req.body);
    // if (error) return res.status(400).json({ message: error.details[0].message });

    const {
        skills,
        location,
        avatar,
        linkedIn,
        instagram,
        twitter,
        onboardingPurpose,
        otherPurpose,
        step
    } = req.body;
    try {
        const { user } = req

        if (!user.verified) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.UnverifiedEmail });
        }

        user.skills = skills || user.skills;
        user.location = location || user.location;
        user.linkedIn = linkedIn || user.linkedIn;
        user.instagram = instagram || user.instagram;
        user.twitter = twitter || user.twitter;
        user.onboardingPurpose = onboardingPurpose || user.onboardingPurpose;
        user.otherPurpose = otherPurpose || user.otherPurpose;
        user.step = step || user
        user.avatar = avatar || user.avatar
        await user.save()

        return res.status(200).json({ message: AppConfig.STRINGS.AccountUpgradedTalent, user: user });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};

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
        otherPurpose,
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
                talentProfile.otherPurpose = otherPurpose || talentProfile.otherPurpose,
                talentProfile.step = step || talentProfile
        } else {
            talentProfile = await TalentDetailsModel.create({
                account: req.user.id,
                skills,
                location,
                linkedIn,
                instagram,
                twitter,
                onboardingPurpose,
                otherPurpose,
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

        return res.status(200).json({ message: AppConfig.STRINGS.AccountUpgradedTalent, user: data });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};

export const businessOnboardingController: RequestHandler = async (req: any, res) => {
    // const { error } = businessUpgradeSchema.validate(req.body);
    // if (error) return res.status(400).json({ message: error.details[0].message });

    const {
        companyName, logo, yoe } = req.body;
    try {
        const { user } = req
        const dbTalent = await TalentDetailsModel.findOne({ account: user.id, })
        if (!user.verified) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.UnverifiedEmail });
        }
        if ((user.type === AppConfig.ACCOUNT_TYPES.TALENT) && dbTalent) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError });
        }
        const logoUrl = await uploadMedia(logo)
        const talent = await BusinessDetailsModel.create({
            account: user.id,
            name: companyName,
            logo: logoUrl,
            yoe
        })
        user.type = AppConfig.ACCOUNT_TYPES.BUSINESS
        await user.save()
        return res.status(200).json({ message: AppConfig.STRINGS.AccountUpgradedBusiness, data: talent });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};
