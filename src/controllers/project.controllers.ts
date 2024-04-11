import { RequestHandler } from "express";
import { ProjectModel } from "../mongodb/models";
import { constructResponse, uploadMedia } from "../services";
import { AppConfig } from "../utilities/config";
import { paginateData } from "../utilities/common";

const createProject: RequestHandler = async (req: any, res) => {

    try {
        const {
            name,
            description,
            projectURL,
            thumbnail,
            images,
            collaborators,
        } = req.body;
        const uploadedThumbnail = await uploadMedia(thumbnail)

        const project = await ProjectModel.create({
            name,
            description,
            projectURL,
            thumbnail: uploadedThumbnail,
            images,
            collaborators,
            owner: req.user.id
        })

        return constructResponse({
            res,
            code: 201,
            message: AppConfig.STRINGS.Success,
            data: project,
            apiObject: AppConfig.API_OBJECTS.Project
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            data: error,
            apiObject: AppConfig.API_OBJECTS.Project
        })
    }
}

const getMyProjects: RequestHandler = async (req: any, res) => {
    try {
        const projects = await ProjectModel.find({ owner: req.user.id })
        const data = paginateData(req.query, projects, 'projects')

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data,
            apiObject: AppConfig.API_OBJECTS.Project
        })

    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            data: error,
            apiObject: AppConfig.API_OBJECTS.Project
        })
    }
}

const getProjects: RequestHandler = async (req: any, res) => {
    try {
        const projects = await ProjectModel.find()
        const data = paginateData(req.query, projects, 'projects')

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data,
            apiObject: AppConfig.API_OBJECTS.Project
        })

    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            data: error,
            apiObject: AppConfig.API_OBJECTS.Project
        })
    }
}

export default {
    createProject,
    getMyProjects,
    getProjects
}