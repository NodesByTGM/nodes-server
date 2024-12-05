import { RequestHandler } from "express";
import { AccountModel, BusinessModel } from "../mongodb/models";
import { EmailService, constructResponse, uploadMedia } from "../services";
import { AppConfig } from "../utilities/config";


const onboarding: RequestHandler = async (req: any, res) => {
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
        onboardingPurposes,
        otherPurpose,
        step
    } = req.body;
    try {
        const user = await AccountModel.findById(req.user.id)

        if (!user) {

            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.UnverifiedEmail,
                apiObject: AppConfig.API_OBJECTS.Account
            })
        }

        const imgUrl = await uploadMedia(avatar)

        user.skills = skills || user.skills;
        user.location = location || user.location;
        user.linkedIn = linkedIn || user.linkedIn;
        user.instagram = instagram || user.instagram;
        user.twitter = twitter || user.twitter;
        user.onboardingPurpose = onboardingPurpose || user.onboardingPurpose;
        user.onboardingPurposes = onboardingPurposes || user.onboardingPurposes;
        user.otherPurpose = otherPurpose || user.otherPurpose;
        user.step = step || user
        user.avatar = imgUrl || user.avatar
        await user.save()

        return constructResponse({
            res,
            code: 200,
            data: user,
            message: AppConfig.STRINGS.OnboardingSuccessful,
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

const verifyBusiness: RequestHandler = async (req: any, res) => {
    // const { error } = businessUpgradeSchema.validate(req.body);
    // if (error) return res.status(400).json({ message: error.details[0].message });
    try {
        const { name, logo, yoe, cac, linkedIn } = req.body;
        const { user } = req
        if (!user.verified) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.UnverifiedEmail,
                apiObject: AppConfig.API_OBJECTS.Account
            })
        }
        if ((user.type === AppConfig.ACCOUNT_TYPES.TALENT)) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.BadRequestError,
                apiObject: AppConfig.API_OBJECTS.Account
            })
        }
        const logoURL = await uploadMedia(logo)
        const cacURL = await uploadMedia(cac)
        const business = await BusinessModel.findOne({ account: user.id })

        if (!business) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.NotFoundError });
        }

        business.name = name || business.name
        business.logo = logoURL || business.logo
        business.cac = cacURL
        business.yoe = yoe || business.yoe
        business.linkedIn = linkedIn || business.linkedIn
        await business.save()
        const account = await AccountModel.findById(user.id)

        EmailService.sendHTMLEmail({
            email: req.user.email,
            subject: 'Business Verification',
            params: {
                subject: 'Business Verification',
                message: 'We have recieved your details and its currently in review, we would let you know when its done.',
            },
            emailType: 'general'
        })
        return constructResponse({
            res,
            code: 200,
            data: account,
            message: AppConfig.STRINGS.DetailsSentForVerification,
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


export default {
    onboarding,
    verifyBusiness
}