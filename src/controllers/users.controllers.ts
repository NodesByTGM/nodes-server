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
 *         description: User successfully registered.
 *         content:
 *           application/json:
 *             example:
 *                 user:
 *                  id: "123456789"
 *                  name: "John Doe"
 *                  email: "john.doe@example.com"
 *                  username: "johndoe"
 *                  dob: "1990-01-01"
 *                  type: 1
 *                  avatar: "https://example.com/avatar.jpg"
 *                  verified: true
 *                  createdAt: "2024-02-14T12:00:00Z"
 *                  updatedAt: "2024-02-14T12:30:00Z"
 *                  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
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
        res.json({ user });
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
            res.json({ user });
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

