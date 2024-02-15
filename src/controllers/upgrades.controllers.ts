import { RequestHandler } from "express";
import { AppConfig } from "../utilities/config";
import { businessUpgradeSchema, talentUpgradeSchema } from "../validations/upgrades.validations";
import { BusinessDetailsModel, TalentDetailsModel } from "../mongodb/models";
import { uploadMedia } from "../services";


/**
 * @swagger
 * /api/v1/upgrades/talent:
 *   post:
 *     summary: Upgrade Account to Talent
 *     description: Upgrade the authenticated user's account to a talent account by providing additional information.
 *     tags:
 *       - Upgrades
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of skills associated with the talent account.
 *                 example: "JavaScript, React, Node.js"
 *               location:
 *                 type: string
 *                 description: The location of the talent (e.g., city, country).
 *                 example: San Francisco, CA
 *               avatar:
 *                 type: string
 *                 description: URL or path to the talent's avatar.
 *                 example: https://example.com/avatar/talent_user.jpg
 *               linkedIn:
 *                 type: string
 *                 description: LinkedIn profile URL of the talent.
 *                 example: https://www.linkedin.com/in/talent_user
 *               instagram:
 *                 type: string
 *                 description: Instagram profile URL of the talent.
 *                 example: https://www.instagram.com/talent_user
 *               twitter:
 *                 type: string
 *                 description: Twitter profile URL of the talent.
 *                 example: https://twitter.com/talent_user
 *               step:
 *                 type: number
 *                 description: Progress on the onboarding form.
 *                 example: 0
 *     responses:
 *       '200':
 *         description: Account successfully upgraded to talent.
 *       '400':
 *         description: Bad request. Check the request payload for missing or invalid information.
 *       '401':
 *         description: Unauthorized. User authentication failed.
 *       '500':
 *         description: Internal Server Error.
 */

export const talentUpgradeController: RequestHandler = async (req: any, res) => {
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

/**
 * @swagger
 * /api/v1/upgrades/business:
 *   post:
 *     summary: Upgrade Account to Business
 *     description: Upgrade the authenticated user's account to a business account by providing additional business information.
 *     tags:
 *       - Upgrades
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: The name of the business company.
 *                 example: ABC Corporation
 *               logo:
 *                 type: string
 *                 description: URL or path to the business logo.
 *                 example: https://example.com/logo/business_logo.png
 *               avatar:
 *                 type: string
 *                 description: URL or path to the business avatar.
 *                 example: https://example.com/avatar/business_avatar.jpg
 *               website:
 *                 type: string
 *                 description: The website URL of the business.
 *                 example: https://www.abccorporation.com
 *               location:
 *                 type: string
 *                 description: The location of the business (e.g., city, country).
 *                 example: New York, NY
 *               industry:
 *                 type: string
 *                 description: The industry in which the business operates.
 *                 example: Technology
 *               tagline:
 *                 type: string
 *                 description: The tagline or slogan of the business.
 *                 example: Innovate Together
 *               size:
 *                 type: string
 *                 description: The size of the business (e.g., small, medium, large).
 *                 example: Medium
 *               type:
 *                 type: string
 *                 description: The type of business (e.g., LLC, Corporation).
 *                 example: LLC
 *               linkedIn:
 *                 type: string
 *                 description: LinkedIn profile URL of the business.
 *                 example: https://www.linkedin.com/company/abccorporation
 *               instagram:
 *                 type: string
 *                 description: Instagram profile URL of the business.
 *                 example: https://www.instagram.com/abccorporation
 *               twitter:
 *                 type: string
 *                 description: Twitter profile URL of the business.
 *                 example: https://twitter.com/abccorporation
 *               profession:
 *                 type: string
 *                 description: The profession or industry focus of the business.
 *                 example: IT Solutions
 *             required:
 *               - companyName
 *               - location
 *               - industry
 *               - tagline
 *               - size
 *               - type
 *               - profession
 *     responses:
 *       '200':
 *         description: Account successfully upgraded to a business account.
 *       '400':
 *         description: Bad request. Check the request payload for missing or invalid information.
 *       '401':
 *         description: Unauthorized. User authentication failed.
 *       '500':
 *         description: Internal Server Error.
 */

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
