import { RequestHandler } from 'express';
import { ChargeSuccessEventData, PaystackWebhookEvent, SubscriptionDisabledEventData } from '../interfaces/paystack';
import { AccountModel, SubscriptionModel, TransactionModel } from '../mongodb/models';
import { constructResponse, initiateSubscription, sendEmail, verifyTxnByReference } from '../services';
import { sendHTMLEmail } from '../services/email.service';
import { BUSINESS_PLAN_CODES, PRO_PLAN_CODES, getBusiness } from '../services/transaction.service';
import { addYearsToDate, formatDate, verifyTransaction } from '../utilities/common';
import { AppConfig } from '../utilities/config';

const verifyPaystackTransaction: RequestHandler = async (req, res) => {
    try {
        const { reference } = req.query;
        if (!reference) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError })
        }
        const verifiedTxn = await verifyTxnByReference(`${reference}`)
        // sendEmail(`${process.env.EMAIL_USER}`, 'Callback Event from paystack', JSON.stringify(req.query))
        if (!verifiedTxn?.status) {
            return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError })
        }
        return res.json({ message: AppConfig.STRINGS.Success, data: verifiedTxn })
    } catch (error) {
        return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError })
    }
}

// INTERNAL
const verifyInternalTransaction: RequestHandler = async (req: any, res) => {
    try {
        const { reference } = req.query;
        console.log(reference)
        if (!reference) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.BadRequestError,
                apiObject: AppConfig.API_OBJECTS.Transaction
            })
        }
        const verifiedTxn = await verifyTxnByReference(`${reference}`)
        // sendEmail(`${process.env.EMAIL_USER}`, 'Callback Event from paystack', JSON.stringify(req.query))
        if (!verifiedTxn?.status) {
            return constructResponse({
                res,
                code: 400,
                message: AppConfig.ERROR_MESSAGES.BadRequestError,
                apiObject: AppConfig.API_OBJECTS.Transaction
            })
        }
        const user = await AccountModel.findById(req.user.id)
        // const data = await getUserFullProfile(user)
        return constructResponse({
            res,
            code: 200,
            data: user,
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

const subscribeToPackage: RequestHandler = async (req: any, res) => {
    try {
        const { planKey, reference, callback_url, metadata } = req.body
        if (planKey === 'pro' || planKey === 'business' || planKey === 'pro-annual' || planKey === 'business-annual') {
            const data = await initiateSubscription({
                email: req.user.email,
                planKey,
                reference,
                callback_url,
                metadata
            })
            if (data) {
                return constructResponse({
                    res,
                    code: 200,
                    data,
                    message: AppConfig.STRINGS.Success,
                    apiObject: AppConfig.API_OBJECTS.Transaction
                })
            }
        }
        return constructResponse({
            res,
            code: 400,
            message: AppConfig.ERROR_MESSAGES.BadRequestError,
            apiObject: AppConfig.API_OBJECTS.Transaction
        })
    } catch (error) {

        return constructResponse({
            res,
            code: 500,
            data: error,
            message: AppConfig.ERROR_MESSAGES.InternalServerError,
            apiObject: AppConfig.API_OBJECTS.Transaction
        })
    }
}

const paystackWebhook: RequestHandler = async (req, res) => {
    const eventData: PaystackWebhookEvent = req.body;
    const signature = req.headers['x-paystack-signature'];
    // console.log(eventData)

    if (!verifyTransaction(eventData, signature)) {
        return res.sendStatus(400);
    }

    if (eventData.event === 'charge.success') {
        const data: ChargeSuccessEventData = eventData.data
        let txnn = await TransactionModel.findOne({ apiId: data.id, status: data.status })
        if (txnn) {
            return res.sendStatus(200)
        }
        sendEmail(`${process.env.EMAIL_USER}`, 'Nodes: Webhook Event from paystack', JSON.stringify(eventData))
        const user = await AccountModel.findOne({ email: data.customer.email })
        if (user) {
            const txn = await TransactionModel.create({
                status: data.status,
                paidAt: data.paid_at,
                amount: data.amount / 100,
                reference: data.reference,
                apiId: data.id,
                description: data.plan ? 'SUBSCRIPTION' : 'CLASSIFIED',
                txnType: AppConfig.TRANSACTION_TYPES.EE,
                source: data.customer.email,
                destination: 'COMPANY'
            })
            let sub = await SubscriptionModel.findOne({ account: user.id })
            if (sub) {
                sub.plan = data.plan.name
                sub.active = true
                sub.paidAt = new Date(data.paidAt)
                sub.account = user.id
                await sub.save()
                return res.sendStatus(200)
            } else {
                sub = await SubscriptionModel.create({
                    plan: data.plan.name,
                    active: true,
                    paidAt: data.paidAt,
                    account: user.id,
                })
            }

            txn.subscription = sub.id
            user.subscription = sub.id

            if (BUSINESS_PLAN_CODES.includes(data.plan.plan_code)) {
                const business = await getBusiness(user, data.plan.name)
                if (business) {
                    user.business = business.id;
                    user.type = AppConfig.ACCOUNT_TYPES.BUSINESS
                }
            }
            if (PRO_PLAN_CODES.includes(data.plan.plan_code)) {
                user.type = AppConfig.ACCOUNT_TYPES.TALENT
            }
            await txn.save()
            await user.save()

            sendHTMLEmail({
                email: user.email,
                subject: 'Your Monthly Subscription Confirmation!',
                params: {
                    name: user.name.split(" ")[0],
                    planName: data.plan.name,
                    planAmount: `N${data.amount / 100}.00`, //TODO: format this well
                    purchaseDate: formatDate(data.paidAt),
                    expiryDate: addYearsToDate(data.paid_at),
                },
                emailType: "subscription"
            })
        }
    }

    if (eventData.event === 'subscription.disable') {
        const data: SubscriptionDisabledEventData = eventData.data
        const user = await AccountModel.findOne({ email: data.customer.email })
        if (user) {
            const sub = await SubscriptionModel.findById(user.subscription)
            if (sub) {
                sub.active = false
                await sub.save()
            }
        }
    }

    return res.sendStatus(200);
    // TODO: should it send back a fail to paystack when the system itself fails and not because it didnt recieve somethnig right?
    // Change the paystack pop up flow
}

export default {
    verifyPaystackTransaction,
    verifyInternalTransaction,
    paystackWebhook,
    subscribeToPackage,
}


