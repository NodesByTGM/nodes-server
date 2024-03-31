import { RequestHandler } from "express";
import { PostModel } from "../mongodb/models";
import { paginateData } from "../utilities/common";
import { AppConfig } from "../utilities/config";
import { config } from "dotenv";

export const getPostsController: RequestHandler = async (req: any, res) => {
    try {
        const { body, author, hashtags, startDate, endDate } = req.query;

        // Construct base query
        let query: any = {};

        // Add filters based on parameters
        if (body) {
            query.body = { $regex: body, $options: 'i' }; // Case-insensitive search for text
        }
        if (author) {
            query.author = author;
        }
        if (hashtags) {
            // query.hashtags = hashtag; // Assuming hashtags are stored in an array field called 'hashtags'
            query.hashtags = { $all: hashtags.split(',') }; // Split hashtags string into array and match all
        }
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // let _sort = -1
        // if(sort === '')
        // const posts = await PostModel.find(query).sort({ createdAt: -1 }).lean();
        const posts = await PostModel.aggregate([
            { $match: query },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    liked: {
                        $in: [req.user.id.toString(), { $map: { input: "$likes", as: "like", in: { $toString: "$$like" } } }]
                    }
                }
            },
            { $project: { __v: 0 } },
            { $addFields: { id: "$_id" } },
            { $unset: "_id" }
        ]);

        // Manually populate the field
        await PostModel.populate(posts, [
            { path: 'author', select: 'name id avatar' },
            { path: 'likes', select: 'name id avatar' }
        ]);
        // const _posts = posts.map(x => ({
        //     ...x,
        //     liked: x.likes.map((y: any) => y.toString()).includes(req.user.id),
        // }))
        const data = paginateData(req.query, posts, 'posts')
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError })
    }
}

export const getPostController: RequestHandler = async (req: any, res) => {
    try {
        const post = await PostModel.findById(req.params.id)

        if (!post) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound })
        }
        const data = {
            ...post?.toJSON(),
            liked: post.likes.map((y: any) => y.toString()).includes(req.user.id)
        }
        return res.status(200).json({ message: AppConfig.STRINGS.Success, post: data })

    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const createPostController: RequestHandler = async (req: any, res) => {
    try {
        const {
            body,
            parent,
            hashtags,
            attachments,
        } = req.body

        if (!body) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError })
        }
        const data = await PostModel.create({
            body,
            parent,
            hashtags,
            attachments,
            author: req.user.id
        });
        if (parent) {
            const post = await PostModel.findById(parent);
            if (post) {
                if (post.comments.filter(x => x.toString() === data.id.toString()).length === 0) {
                    post.comments.push(data.id)
                    await post.save()
                }
            }
        }
        // const posts = await PostModel.find();
        // const data = paginateData(req.query, posts, 'posts')
        // return res.status(200).json(data)
        return res.status(200).json({ message: AppConfig.STRINGS.Success, data })
    } catch (error) {
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError })
    }
}

export const likePostController: RequestHandler = async (req: any, res) => {
    try {
        const post = await PostModel.findById(req.params.id)
        if (!post) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound })
        }
        if (post.likes.filter(x => x.toString() === req.user.id.toString()).length > 0) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.AlreadyLiked })
        }
        post.likes.push(req.user)
        await post.save()
        const data: any = post.toJSON()
        data.saved = true

        return res.status(200).json({ message: AppConfig.STRINGS.Success, post: data })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const unlikePostController: RequestHandler = async (req: any, res) => {
    try {
        const post = await PostModel.findById(req.params.id)
        if (!post) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ResourceNotFound })
        }
        if (post.likes.filter(x => x.toString() === req.user.id.toString()).length > 0) {
            post.likes = post.likes.filter(x => x.toString() !== req.user.id.toString())
            await post.save()
        }
        const data: any = post.toJSON()
        data.liked = false

        return res.status(200).json({ message: AppConfig.STRINGS.Success, event: data })
    } catch (error) {
        return res.status(400).json({ error })
    }
}
