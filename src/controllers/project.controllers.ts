import { RequestHandler } from "express";
import { ProjectModel } from "../mongodb/models";
import { uploadMedia } from "../services";
import { AppConfig } from "../utilities/config";

export const projectCreateController: RequestHandler = async (req: any, res) => {

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
            account: req.user.id
        })

        return res.status(200).json({ message: AppConfig.STRINGS.Success, project });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
}


export const allprojectsController: RequestHandler = async (req: any, res) => {
    try {
        const projects = await ProjectModel.find({ account: req.user.id })
        return res.status(200).json({ message: AppConfig.STRINGS.Success, projects });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError });
    }
}