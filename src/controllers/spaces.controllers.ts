import { RequestHandler } from "express"
import { SpaceModel } from "../mongodb/models"
import { paginateData } from "../utilities/common"
import { constructResponse } from "../services"
import { AppConfig } from "../utilities/config"

export const getSpacesController: RequestHandler = async (req: any, res) => {
    try {
        const projects = await SpaceModel.find()
        const data = paginateData(req.query, projects, 'spaces')

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data,
            apiObject: AppConfig.API_OBJECTS.Space
        })

    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            data: error,
            apiObject: AppConfig.API_OBJECTS.Space
        })
    }
}

export const getMySpacesController: RequestHandler = async (req: any, res) => {
    try {
        const projects = await SpaceModel.find({ owner: req.user.id })
        const data = paginateData(req.query, projects, 'spaces')

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data,
            apiObject: AppConfig.API_OBJECTS.Space
        })

    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            data: error,
            apiObject: AppConfig.API_OBJECTS.Space
        })
    }
}

// TODO
// create
// join memeber
// make admin
// add rules
// follow space
// followed spaces
// foolow concversation
// report post
// message user