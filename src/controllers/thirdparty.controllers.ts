import { RequestHandler } from "express";
import { constructResponse, getExternalNews } from "../services";
import { AppConfig } from "../utilities/config";
import { getExternalMedia } from "../services/thirdparty.service";

const getNews: RequestHandler = async (req: any, res) => {
    try {
        const news = await getExternalNews({})
        if (news) {
            return constructResponse({
                res,
                data: news.items,
                code: 200,
                message: AppConfig.STRINGS.Success,
                apiObject: AppConfig.API_OBJECTS.News
            })
        } else {

            return constructResponse({
                res,
                code: 500,
                message: AppConfig.ERROR_MESSAGES.ServiceUnavailable,
                apiObject: AppConfig.API_OBJECTS.News
            })
        }
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.ServiceUnavailable,
            apiObject: AppConfig.API_OBJECTS.News
        })
    }
}

const getTrendingMedia: RequestHandler = async (req: any, res) => {
    try {
        const movies = await getExternalMedia()
        if (movies) {
            return constructResponse({
                res,
                data: movies,
                code: 200,
                message: AppConfig.STRINGS.Success,
                apiObject: AppConfig.API_OBJECTS.MoviesTV
            })
        } else {

            return constructResponse({
                res,
                code: 500,
                message: AppConfig.ERROR_MESSAGES.ServiceUnavailable,
                apiObject: AppConfig.API_OBJECTS.MoviesTV
            })
        }
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.ServiceUnavailable,
            apiObject: AppConfig.API_OBJECTS.MoviesTV
        })
    }
}




export default {
    getNews,
    getTrendingMedia
}