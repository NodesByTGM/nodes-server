import { RequestHandler } from 'express';
import { AccountModel } from '../mongodb/models';

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Get User Profile
 *     description: Retrieve the authenticated user's profile information.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The full name of the user.
 *                   example: John Doe
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                   example: john_doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user.
 *                   example: john@example.com
 *                 dob:
 *                   type: string
 *                   format: date
 *                   description: The date of birth of the user (in YYYY-MM-DD format).
 *                   example: 1990-01-01
 *                 verified:
 *                   type: boolean
 *                   description: Indicates whether the user's account is verified.
 *                   example: true
 *                 avatar:
 *                   type: string
 *                   description: URL or path to the user's avatar.
 *                   example: https://example.com/avatar/john_doe.jpg
 *                 type:
 *                   type: string
 *                   description: The type of user account (e.g., regular user, admin).
 *                   example: regular
 *       '401':
 *         description: Unauthorized. User authentication failed.
 *       '500':
 *         description: Internal Server Error.
 */

export const profileController: RequestHandler = async (req: any, res: any) => {
    // res.json({ message: `Welcome ${req.user.username}` });
    try {
        const user = await AccountModel.findById(req.user.id)
        // const posts = await Post.find({ accountId: req.user.id })
        res.json({ data: { user }, });
    } catch (error) {
        res.json({ error: JSON.stringify(error) })
    }
};

export const profileUpdateController: RequestHandler = async (req: any, res: any) => {
    // res.json({ message: `Welcome ${req.user.username}` });
    try {
        const {
            name: fullname,
            username,
            avatar,
            bio,
            category
        } = req.body

        const user = await AccountModel.findById(req.user.id)
        if (user) {
            user.username = username || user.username
            user.name = fullname || user.name
            user.avatar = avatar || user.avatar
            user.save()
            res.json({ data: user });
        }

    } catch (error) {
        res.json({ error: JSON.stringify(error) })
    }
};

export const allUsersContoller: RequestHandler = async (req, res) => {
    try {
        const users = await AccountModel.find({}, { password: 0 })
        res.json({ message: users });
    } catch (error) {
        res.json({ error: JSON.stringify(error) })
    }
};

