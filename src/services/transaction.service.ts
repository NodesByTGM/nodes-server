import { AxiosResponse } from "axios"
import dotenv from "dotenv"
import { InitiateTransactionResult, PaystackVerifiedTransaction } from "../interfaces/paystack"
import { AccountModel, BusinessModel, SubscriptionModel, TransactionModel } from "../mongodb/models"
import { mainClient } from "../utilities/axios.client"
import { addYearsToDate, formatDate } from "../utilities/common"
import { AppConfig } from "../utilities/config"
import { sendHTMLEmail } from "./email.service"


dotenv.config();

export const PLANKS_KVP = {
    'pro': process.env.PRO_PLAN,
    'business': process.env.BUSINESS_PLAN,
    'pro-annual': process.env.PRO_ANNUAL_PLAN,
    'business-annual': process.env.BUSINESS_ANNUAL_PLAN,
}

export const PRO_PLAN_CODES = [
    `${process.env.PRO_PLAN}`,
    `${process.env.PRO_ANNUAL_PLAN}`
]

export const BUSINESS_PLAN_CODES = [
    `${process.env.BUSINESS_PLAN}`,
    `${process.env.BUSINESS_ANNUAL_PLAN}`
]


export const verifyTxnByReference = async (reference: string) => {
    const url = `https://api.paystack.co/transaction/verify/${reference}`
    const headers = {
        Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET_KEY}`,
    }
    try {
        const req = await mainClient.get(url, { headers })
        if (req.status === 200) {
            const reqData: PaystackVerifiedTransaction = req.data;
            if (reqData.status) {
                await createTransaction(reqData)
                return { status: reqData.status }
            }
            return { status: false }
        }
    } catch (error) {
        // console.log(error)
        return { status: false }
    }
}

export const createTransaction = async (reqData: PaystackVerifiedTransaction) => {
    const { data } = reqData
    if (!data) {
        return
    }
    const old = await TransactionModel.findOne({ apiId: data.id })
    if (old) {
        return
    }

    if (data?.plan) {
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
                sub.plan = data.plan_object.name
                sub.active = true
                sub.paidAt = new Date(data.paidAt)
                sub.account = user.id
                await sub.save()
            } else {
                sub = await SubscriptionModel.create({
                    plan: data.plan_object.name,
                    active: true,
                    paidAt: data.paidAt,
                    account: user.id,
                })
            }

            txn.subscription = sub.id
            user.subscription = sub.id
            if (BUSINESS_PLAN_CODES.includes(data.plan_object.plan_code)) {
                const business = await getBusiness(user, data.plan_object.name)
                if (business) {
                    user.business = business.id;
                    user.type = AppConfig.ACCOUNT_TYPES.BUSINESS
                }
            }
            if (PRO_PLAN_CODES.includes(data.plan_object.plan_code)) {
                user.type = AppConfig.ACCOUNT_TYPES.TALENT
            }
            await user.save()
            await txn.save()

            sendHTMLEmail({
                email: user.email,
                subject: 'Your Monthly Subscription Confirmation!',
                params: {
                    name: user.name.split(" ")[0],
                    planName: data.plan_object.name,
                    planAmount: `N${data.amount / 100}.00`, //TODO: format this well
                    purchaseDate: formatDate(data.paidAt),
                    expiryDate: addYearsToDate(data.paid_at),
                },
                emailType: "subscription"
            })
        }
    }
    return
}

export const initiateSubscription = async ({
    email,
    planKey,
    reference,
    callback_url,
    metadata
}: {
    email: string,
    planKey: 'pro' | 'pro-annual' | 'business' | 'business-annual',
    reference: string,
    callback_url: string,
    metadata: string,
}) => {
    try {
        const result: AxiosResponse<InitiateTransactionResult> = await mainClient.post('https://api.paystack.co/transaction/initialize', {
            email,
            plan: PLANKS_KVP[planKey],
            amount: 100,
            reference,
            callback_url,
            metadata
        }, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET_KEY}` } })
        if (result.status === 200) {
            const data = result.data;
            if (data.status) {
                return data.data.authorization_url
            }
        }
        return ""
    } catch (error) {
        throw error
        // return ""
    }
}

export const checkTxnExists = async (reference: string) => {
    const txn = await TransactionModel.findOne({ reference })
    if (txn) {
        return true
    }
    return false
}

export const getBusiness = async (user: any, planName: string) => {
    if (planName !== 'Business') {
        return null
    }
    let business;
    business = await BusinessModel.findOne({ account: user.id })
    if (!business) {
        business = await BusinessModel.create({ account: user.id })
    }
    return business
}