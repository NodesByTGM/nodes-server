import { RequestHandler } from "express";
import { constructResponse, deleteMedia, uploadMedia } from "../services";
import { AppConfig } from "../utilities/config";

export const uploadMediaController: RequestHandler = async (req: any, res) => {
    try {
        const file = req.body.file
        const data = await uploadMedia(file)
        if (!data) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.BadRequestError,
                apiObject: AppConfig.API_OBJECTS.Media
            })
        }
        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Media
        })
    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Media
        })
    }
}

export const deleteMediaController: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id
        const data = await deleteMedia(id)
        if (!data) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.BadRequestError,
                apiObject: AppConfig.API_OBJECTS.Media
            })
        }
        return constructResponse({
            res,
            code: 200,
            data,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Media
        })
    } catch (error) {
        return constructResponse({
            res,
            data: error,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Media
        })
    }
}