import { RequestHandler } from "express";
import { constructResponse, getExternalNews } from "../services";
import { AppConfig } from "../utilities/config";

const getNews: RequestHandler = async (req: any, res) => {
    try {
        const news = await getExternalNews({})
        if (news) {
            return constructResponse({
                res,
                data: news.items,
                code: 200,
                message: AppConfig.STRINGS.Success,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        } else {

            return constructResponse({
                res,
                code: 500,
                message: AppConfig.ERROR_MESSAGES.ServiceUnavailable,
                apiObject: AppConfig.API_OBJECTS.Event
            })
        }
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.ServiceUnavailable,
            apiObject: AppConfig.API_OBJECTS.Event
        })
    }
}

export default {
    getNews
}