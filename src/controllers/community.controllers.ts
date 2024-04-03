import { RequestHandler } from "express";
import { PostModel } from "../mongodb/models";
import { constructResponse } from "../services";
import { paginateData } from "../utilities/common";
import { AppConfig } from "../utilities/config";

export const getCommunityPostsController: RequestHandler = async (req: any, res) => {
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
            { $project: { __v: 0, 'author.subscription': 0, 'author.business': 0 } },
            { $addFields: { id: "$_id" } },
            { $unset: "_id" }
        ]);

        // Manually populate the field
        await PostModel.populate(posts, [
            { path: 'author', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'likes', select: 'name id avatar', options: { autopopulate: false } }
        ]);
        // const _posts = posts.map(x => ({
        //     ...x,
        //     liked: x.likes.map((y: any) => y.toString()).includes(req.user.id),
        // }))
        const data = paginateData(req.query, posts, 'posts')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    }
}

export const getCommunityPostController: RequestHandler = async (req: any, res) => {
    try {
        const post = await PostModel.findById(req.params.id)

        if (!post) {
            return constructResponse({
                res,
                data: post,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.Post
            })
        }
        const data = {
            ...post?.toJSON(),
            liked: post.likes.map((y: any) => y.toString()).includes(req.user.id)
        }
        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    } catch (error) {

        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    }
}

export const createCommunityPostController: RequestHandler = async (req: any, res) => {
    try {
        const {
            body,
            parent,
            hashtags,
            attachments,
        } = req.body

        if (!body) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.BadRequestError,
                apiObject: AppConfig.API_OBJECTS.Post
            })
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

        return constructResponse({
            res,
            data,
            code: 201,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    } catch (error) {

        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    }
}

export const likeCommunityPostController: RequestHandler = async (req: any, res) => {
    try {
        const post = await PostModel.findById(req.params.id)
        if (!post) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.Post
            })
        }
        if (post.likes.filter(x => x.toString() === req.user.id.toString()).length > 0) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.AlreadyLiked,
                apiObject: AppConfig.API_OBJECTS.Post
            })
        }
        post.likes.push(req.user)
        await post.save()
        const data: any = post.toJSON()
        data.saved = true

        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    } catch (error) {

        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    }
}

export const unlikeCommunityPostController: RequestHandler = async (req: any, res) => {
    try {
        const post = await PostModel.findById(req.params.id)
        if (!post) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.ResourceNotFound,
                apiObject: AppConfig.API_OBJECTS.Post
            })
        }
        if (post.likes.filter(x => x.toString() === req.user.id.toString()).length > 0) {
            post.likes = post.likes.filter(x => x.toString() !== req.user.id.toString())
            await post.save()
        }
        const data: any = post.toJSON()
        data.liked = false

        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Post
        })
    }
}