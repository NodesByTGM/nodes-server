import { RequestHandler } from "express";
import { AppConfig } from "../utilities/config";
import { businessUpgradeSchema, talentUpgradeSchema } from "../validations/upgrades.validations";
import { BusinessDetailsModel, TalentDetailsModel } from "../mongodb/models";
import { uploadMedia } from "../services";

export const talentUpgradeController: RequestHandler = async (req: any, res) => {
    const { error } = talentUpgradeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
        skills,
        location,
        avatar,
        linkedIn,
        instagram,
        twitter } = req.body;
    try {
        const { user } = req
        const dbTalent = await TalentDetailsModel.findOne({ account: req.user.id, })
        if (!user.verified) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.UnverifiedEmail });
        }
        if ((user.type === AppConfig.ACCOUNT_TYPES.TALENT) && dbTalent) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError });
        }
        const talent = await TalentDetailsModel.create({
            accountId: req.user.id,
            skills,
            location,
            linkedIn,
            instagram,
            twitter
        })

        user.type = AppConfig.ACCOUNT_TYPES.TALENT
        user.avatar = avatar
        await user.save()

        return res.status(200).json({ message: AppConfig.STRINGS.AccountUpgradedTalent, data: talent });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
};


export const businessUpgradeController: RequestHandler = async (req: any, res) => {
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
