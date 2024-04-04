import { RequestHandler } from "express"
import { AccountModel, SpaceModel } from "../mongodb/models"
import { paginateData } from "../utilities/common"
import { constructResponse } from "../services"
import { AppConfig } from "../utilities/config"

export const getSpaces: RequestHandler = async (req: any, res) => {
    try {
        const spaces = await SpaceModel.find()
        await SpaceModel.populate(spaces, [
            { path: 'owner', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'members.account', select: 'name id avatar', options: { autopopulate: false } }
        ]);
        const data = paginateData(req.query, spaces, 'spaces')

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

export const getMySpaces: RequestHandler = async (req: any, res) => {
    try {
        const spaces = await SpaceModel.find({ owner: req.user.id })
        await SpaceModel.populate(spaces, [
            { path: 'owner', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'members.account', select: 'name id avatar', options: { autopopulate: false } }
        ]);
        const data = paginateData(req.query, spaces, 'spaces')

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

export const createSpace: RequestHandler = async (req: any, res) => {
    try {
        const {
            name,
            description,
            thumbnail,
            rules
        } = req.body
        // if (req.user.type === AppConfig.ACCOUNT_TYPES.BUSINESS) {

        // }
        const space = await SpaceModel.create({
            name,
            description,
            thumbnail,
            rules,
            owner: req.user.id
        })
        space.members.create({ account: req.user.id, status: AppConfig.MEMBER_TYPES.Admin })
        await SpaceModel.populate(space, [
            { path: 'owner', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'members.account', select: 'name id avatar', options: { autopopulate: false } }
        ]);
        return constructResponse({
            res,
            code: 201,
            message: AppConfig.STRINGS.Success,
            data: space,
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

export const updateSpace: RequestHandler = async (req: any, res) => {
    try {
        const {
            name,
            description,
            thumbnail,
            rules
        } = req.body
        const { id } = req.params
        let space = await SpaceModel.findById(id)
        if (!space) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        if (space.owner !== req.user.id) {
            return constructResponse({
                res,
                code: 400,
                message: 'You\'re not the owner of this space',
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }

        space.name = name
        space.description = description
        space.thumbnail = thumbnail
        space.rules = rules
        space = await space.save()

        await SpaceModel.populate(space, [
            { path: 'owner', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'members.account', select: 'name id avatar', options: { autopopulate: false } }
        ]);

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data: space,
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

export const getSpace: RequestHandler = async (req: any, res) => {
    try {
        const { id } = req.params
        let space = await SpaceModel.findById(id)
        if (!space) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        await SpaceModel.populate(space, [
            { path: 'owner', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'members.account', select: 'name id avatar', options: { autopopulate: false } }
        ]);

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data: space,
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

export const deleteSpace: RequestHandler = async (req: any, res) => {
    try {
        const { id } = req.params
        let space = await SpaceModel.findById(id)
        if (!space) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        await space.deleteOne()

        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
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

export const joinSpace: RequestHandler = async (req: any, res) => {
    try {
        const { id } = req.params
        const space = await SpaceModel.findById(id)
        if (!space) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        if (space.members.filter(x => x.account.id === req.user.id).length > 0) {
            return constructResponse({
                res,
                code: 400,
                message: 'You\'re already a member of this space',
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        space.members.create({ account: req.user.id })
        await space.save()

        await SpaceModel.populate(space, [
            { path: 'owner', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'members.account', select: 'name id avatar', options: { autopopulate: false } }
        ]);
        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data: space,
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

export const leaveSpace: RequestHandler = async (req: any, res) => {
    try {
        const { id } = req.params
        const space = await SpaceModel.findById(id)
        if (!space) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        if (!(space.members.filter(x => x.account.id === req.user.id).length > 0)) {
            return constructResponse({
                res,
                code: 400,
                message: 'You\'re not a member of this space',
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        space.members.remove({ account: req.user.id })
        await space.save()

        await SpaceModel.populate(space, [
            { path: 'owner', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'members.account', select: 'name id avatar', options: { autopopulate: false } }
        ]);
        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data: space,
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

export const addMemberToSpace: RequestHandler = async (req: any, res) => {
    try {
        const { id } = req.params
        const { accountId, status } = req.body
        const space = await SpaceModel.findById(id)
        const account = await AccountModel.findById(accountId)
        if (!space || !account) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        if (space.members.filter(x => x.account.id === req.user.id).length > 0) {
            return constructResponse({
                res,
                code: 400,
                message: 'This user is already a member of this space',
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        space.members.create({ account: req.user.id, status })
        await space.save()
        await SpaceModel.populate(space, [
            { path: 'owner', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'members.account', select: 'name id avatar', options: { autopopulate: false } }
        ]);
        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data: space,
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

export const removeMemberFromSpace: RequestHandler = async (req: any, res) => {
    try {
        const { id } = req.params
        const { accountId } = req.body
        const space = await SpaceModel.findById(id)
        const account = await AccountModel.findById(accountId)
        if (!space || !account) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        if (!(space.members.filter(x => x.account.id.toString() === accountId).length > 0)) {
            return constructResponse({
                res,
                code: 400,
                message: 'This user is not a member of this space',
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        space.members.remove({ account: req.user.id })
        await space.save()
        await SpaceModel.populate(space, [
            { path: 'owner', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'members.account', select: 'name id avatar', options: { autopopulate: false } }
        ]);
        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data: space,
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

export const makeSpaceAdmin: RequestHandler = async (req: any, res) => {
    try {
        const { accountId, status } = req.body
        const { id } = req.params
        let space = await SpaceModel.findById(id)

        if (!space) {
            return constructResponse({
                res,
                code: 404,
                message: AppConfig.ERROR_MESSAGES.NotFoundError,
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        if (space.owner !== req.user.id) {
            return constructResponse({
                res,
                code: 400,
                message: 'You\'re not the owner of this space',
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }
        const memeberFilter = space.members.filter(x => x.account.id.toString() === accountId)

        if (!(memeberFilter.length > 0)) {
            return constructResponse({
                res,
                code: 400,
                message: 'This user is not a member of this space',
                apiObject: AppConfig.API_OBJECTS.Space
            })
        }

        // space.members.findIndex(memeberFilter[0].id)
        memeberFilter[0].status = AppConfig.MEMBER_TYPES.Admin
        await memeberFilter[0].save()
        space = await space.save()

        await SpaceModel.populate(space, [
            { path: 'owner', select: 'name id avatar', options: { autopopulate: false } },
            { path: 'members.account', select: 'name id avatar', options: { autopopulate: false } }
        ]);
        return constructResponse({
            res,
            code: 200,
            message: AppConfig.STRINGS.Success,
            data: space,
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

export default {
    getSpaces,
    getMySpaces,
    createSpace,
    updateSpace,
    deleteSpace,
    getSpace,
    joinSpace,
    leaveSpace,
    addMemberToSpace,
    removeMemberFromSpace,
    makeSpaceAdmin
}
// TODO
// join memeber
// make admin
// add rules
// follow space
// followed spaces
// foolow conversation
// report post/conversation
// message user

// delete your account
// transactions history
// Business
// Fri, Aug 25, 2023
// 50000
// Active

// analytics