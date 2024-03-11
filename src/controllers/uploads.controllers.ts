import { RequestHandler } from "express";
import { deleteMedia, uploadMedia } from "../services";
import { AppConfig } from "../utilities/config";

export const uploadMediaController: RequestHandler = async (req: any, res) => {
    try {
        const file = req.body.file
        const data = await uploadMedia(file)
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const deleteMediaController: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id
        const data = await deleteMedia(id)
        if (!data) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError })
        }
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(400).json({ error })
    }
}