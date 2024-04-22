import { RequestHandler } from "express";
import { AccountModel, AdminModel, SubscriptionModel } from "../mongodb/models";
import { constructResponse } from "../services";
import { paginateData } from "../utilities/common";
import { AppConfig } from "../utilities/config";

const getAllUsers: RequestHandler = async (req: any, res) => {
    try {
        const { skills, name } = req.query;

        // Construct base query
        let query: any = {};

        // Add filters based on parameters
        if (skills) {
            query.skills = { $regex: skills, $options: 'i' }; // Case-insensitive search for text
        }
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const accounts = await AccountModel.aggregate([
            { $match: query },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    name: "$name",
                    email: "$email",
                    username: "$username",
                    dateJoined: "$createdAt",
                    avatar: "$avatar",
                    id: "$_id",
                    type: "$type"
                }
            },
            { $unset: ["_id", "__v"] },
        ]);

        await AccountModel.populate(accounts, [
            { path: 'business', options: { autopopulate: false } },
            { path: 'subscription', options: { autopopulate: false } },
        ])

        const data = paginateData(req.query, accounts, 'accounts')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Account
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Account
        })
    }
}

const getAllMembers: RequestHandler = async (req: any, res) => {
    try {
        const { name } = req.query;

        // Construct base query
        let query: any = {
            role: { $regex: AppConfig.ADMIN_ROLES.MEMBER }
        };
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const members = await AdminModel.aggregate([
            { $match: query },
            { $sort: { createdAt: -1 } },
            { $addFields: { id: "$_id" } },
            { $unset: ["_id", "__v"] },
        ]);

        const data = paginateData(req.query, members, 'members')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Admin
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Admin
        })
    }
}

const getSubscriptions: RequestHandler = async (req: any, res) => {
    try {
        const { status, startDate, endDate } = req.query;

        // Construct base query
        let query: any = {};

        // Add filters based on parameters
        if (status) {
            query.status = { $regex: status, $options: 'i' }; // Case-insensitive search for text
        }

        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else {

            if (startDate) {
                query.createdAt = { $gte: new Date(startDate) };
            } else if (endDate) {
                query.createdAt = { $lte: new Date(endDate) };
            }
        }

        const subscriptions = await SubscriptionModel.find({})
        await SubscriptionModel.populate(subscriptions, [
            { path: 'account', select: 'name avatar id type', options: { autopopulate: false } }
        ])

        const data = paginateData(req.query, subscriptions, 'subscriptions')
        return constructResponse({
            res,
            data,
            code: 200,
            message: AppConfig.STRINGS.Success,
            apiObject: AppConfig.API_OBJECTS.Subscription
        })
    } catch (error) {
        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Subscription
        })
    }
}

const getAnalytics: RequestHandler = async (req: any, res) => {

}

export default {
    getAllUsers,
    getAllMembers,
    getSubscriptions,
    getAnalytics
}