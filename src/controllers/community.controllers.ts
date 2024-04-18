import { RequestHandler } from "express";
import { AccountModel, PostModel } from "../mongodb/models";
import { constructResponse } from "../services";
import { paginateData } from "../utilities/common";
import { AppConfig } from "../utilities/config";


const connectToUser: RequestHandler = async (req: any, res) => {
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

const disconnectFromUser: RequestHandler = async (req: any, res) => {
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

export default {
    connectToUser,
    disconnectFromUser
}