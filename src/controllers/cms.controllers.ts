import { RequestHandler } from "express";
import { ContentModel } from "../mongodb/models";
import { constructResponse, uploadMedia } from "../services";
import { paginateData } from "../utilities/common";
import { AppConfig } from "../utilities/config";

const createContent: RequestHandler = async (req: any, res) => {
    try {
        const {
            title,
            description,
            thumbnail,
            category,
            status = AppConfig.CONTENT_STATUSES.Draft
        } = req.body;
        const uploadedThumbnail = await uploadMedia(thumbnail)

        const content = await ContentModel.create({
            title,
            description,
            category,
            status,
            thumbnail: uploadedThumbnail,
            author: req.user.id
        })
        await ContentModel.populate(content, [
            { path: 'author', select: 'name avatar id', options: { autopopulate: false } }
        ])

        return constructResponse({
            res,
            code: 201,
            message: AppConfig.STRINGS.Success,
            data: content,
            apiObject: AppConfig.API_OBJECTS.Content
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            data: error,
            apiObject: AppConfig.API_OBJECTS.Content
        })
    }
}

const updateContent: RequestHandler = async (req: any, res) => {
    try {
        const {
            title,
            description,
            thumbnail,
            category,
            status = AppConfig.CONTENT_STATUSES.Draft
        } = req.body;
        const uploadedThumbnail = await uploadMedia(thumbnail)
        const content = await ContentModel.findById(req.params.id)


        if (!content) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Content
            })
        }
        
        if (content.author.id !== req.user.id) {
            return constructResponse({
                res,
                code: 401,
                message: AppConfig.ERROR_MESSAGES.UnauthorizedAccess,
                apiObject: AppConfig.API_OBJECTS.Content
            })
        }

        content.title = title || content.title
        content.description = description || content.description
        content.category = category || content.category
        content.status = status || content.status
        content.thumbnail = uploadedThumbnail || content.thumbnail
        await content.save()


        await ContentModel.populate(content, [
            { path: 'author', select: 'name avatar id', options: { autopopulate: false } }
        ])

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data: content,
            apiObject: AppConfig.API_OBJECTS.Content
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            data: error,
            apiObject: AppConfig.API_OBJECTS.Content
        })
    }
}

const getContent: RequestHandler = async (req: any, res) => {
    try {
        const content = await ContentModel.findById(req.params.id)

        if (!content) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Content
            })
        }

        await ContentModel.populate(content, [
            { path: 'author', select: 'name avatar id', options: { autopopulate: false } }
        ])

        return constructResponse({
            res,
            code: 201,
            message: AppConfig.STRINGS.Success,
            data: content,
            apiObject: AppConfig.API_OBJECTS.Content
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            data: error,
            apiObject: AppConfig.API_OBJECTS.Content
        })
    }
}

const getAllContents: RequestHandler = async (req: any, res) => {
    try {
        const { title, category } = req.query;

        // Construct base query
        let query: any = {
            status: { $regex: AppConfig.CONTENT_STATUSES.Published, $options: 'i' }
        };

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const contents = await ContentModel.aggregate([
            { $match: query },
            { $sort: { createdAt: -1 } }, {
                $lookup: {
                    from: 'posts',
                    let: { contentId: '$_id', contentType: '$type' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$type', '$$contentType'] },
                                        { $eq: ['$foreignKey', '$$contentId'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'comments'
                }
            },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] },
        ]);

        await ContentModel.populate(contents, [
            { path: 'author', select: 'name avatar', options: { autopopulate: false } },
        ])

        const data = paginateData(req.query, contents, 'contents')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Content
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Content
        })
    }
}

const getAllContentsForAdmin: RequestHandler = async (req: any, res) => {
    try {
        const { status, title, category } = req.query;

        // Construct base query
        let query: any = {};

        // Add filters based on parameters
        if (status) {
            query.status = { $regex: status, $options: 'i' }; // Case-insensitive search for text
        }
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const contents = await ContentModel.aggregate([
            { $match: query },
            { $sort: { createdAt: -1 } }, {
                $lookup: {
                    from: 'posts',
                    let: { contentId: '$_id', contentType: '$type' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$type', '$$contentType'] },
                                        { $eq: ['$foreignKey', '$$contentId'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'comments'
                }
            },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] },
        ]);

        await ContentModel.populate(contents, [
            { path: 'author', select: 'name id avatar', options: { autopopulate: false } },
        ])

        const data = paginateData(req.query, contents, 'contents')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Content
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Content
        })
    }
}


export default {
    createContent,
    getContent,
    updateContent,
    getAllContents,
    getAllContentsForAdmin
}