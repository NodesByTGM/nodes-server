import { RequestHandler } from "express";
import { AppConfig } from "../utilities/config";
import { NotificationModel } from "../mongodb/models";
import { paginateData } from "../utilities/common";
import { constructResponse } from "../services";

const getMyNotifications: RequestHandler = async (req: any, res) => {
    try {
        const notifications = await NotificationModel.find({ account: req.user.id })

        const data = paginateData(req.query, notifications, 'notifications')
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

const removeNotification: RequestHandler = async (req: any, res) => {
    try {
        const notification = await NotificationModel.findById(req.params.id)
        if (!notification) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Notification
            })
        }
        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Notification
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Notification
        })
    }
}

export default {
    getMyNotifications,
    removeNotification
}