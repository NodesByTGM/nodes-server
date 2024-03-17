import { AxiosResponse } from "axios"
import dotenv from "dotenv"
import { InitiateTransactionResult, PaystackWebhookEvent } from "../interfaces/paystack"
import { AccountModel, SubscriptionModel, TransactionModel } from "../mongodb/models"
import { mainClient } from "../utilities/axios.client"
import { addYearsToDate, formatDate } from "../utilities/common"
import { AppConfig } from "../utilities/config"
import { sendHTMLEmail } from "./email.service"


dotenv.config();

interface RootObject {
    status: boolean;
    message: string;
    data: {
        id: number;
        domain: string;
        status: string;
        reference: string;
        receipt_number?: any;
        amount: number;
        message: string;
        gateway_response: string;
        paid_at: string;
        created_at: string;
        channel: string;
        currency: string;
        ip_address: string;
        metadata: {
            referrer: string;
        };
        log: {
            start_time: number;
            time_spent: number;
            attempts: number;
            authentication: string;
            errors: number;
            success: boolean;
            mobile: boolean;
            input: any[];
            history: any[];
        };
        fees: number;
        fees_split?: any;
        authorization: {
            authorization_code: string;
            bin: string;
            last4: string;
            exp_month: string;
            exp_year: string;
            channel: string;
            card_type: string;
            bank: string;
            country_code: string;
            brand: string;
            reusable: boolean;
            signature: string;
            account_name?: any;
            receiver_bank_account_number?: any;
            receiver_bank?: any;
        };
        customer: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            customer_code: string;
            phone: string;
            metadata?: any;
            risk_action: string;
            international_format_phone?: any;
        };
        plan: string;
        split: Split;
        order_id?: any;
        paidAt: string;
        createdAt: string;
        requested_amount: number;
        pos_transaction_data?: any;
        source?: any;
        fees_breakdown?: any;
        connect?: any;
        transaction_date: string;
        plan_object: {
            id: number;
            name: string;
            plan_code: string;
            description?: any;
            amount: number;
            interval: string;
            send_invoices: boolean;
            send_sms: boolean;
            currency: string;
        };
        subaccount: Split;
    };
}

interface Split {
}


export const verifyTxnByReference = async (reference: string) => {
    const url = `https://api.paystack.co/transaction/verify/${reference}`
    const headers = {
        Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET_KEY}`,
    }
    try {
        const req = await mainClient.get(url, { headers })
        if (req.status === 200) {
            const reqData: RootObject = req.data;
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

export const createTransaction = async (reqData: RootObject) => {
    const { data } = reqData
    if (!data) {
        return
    }
    console.log(data.plan)
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
            user.subscription = sub
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

export const initiateTransaction = async (amount: number, plan: string) => {

}

export type PlanKeyType = 'new-talent' |
    'creative-starter-pack' |
    'aspiring-entrepreneur' |
    'cef'

const PLANKS_KVP: any = {
    'new-talent': process.env.NEW_TALENT_PLAN,
    'creative-starter-pack': process.env.CREATIVE_STARTER_PLAN,
    'aspiring-entrepreneur': process.env.ASPIRING_ENTREPRENEUR_PACK_PLAN,
    'cef': process.env.CREATIVE_ENTREPRENEUR_PLAN,
}

const reverse_kvp = {
    [`${process.env.NEW_TALENT_PLAN}`]: 'new-talent',
    [`${process.env.CREATIVE_STARTER_PLAN}`]: 'creative-starter-pack',
    [`${process.env.ASPIRING_ENTREPRENEUR_PACK_PLAN}`]: 'aspiring-entrepreneur',
    [`${process.env.CREATIVE_ENTREPRENEUR_PLAN}`]: 'cef',
    '': process.env.CREATIVE_STARTER_PLAN,

}



export const addSubscription = async (email: string, planKey: PlanKeyType) => {
    try {
        const result: AxiosResponse<InitiateTransactionResult> = await mainClient.post('https://api.paystack.co/transaction/initialize', {
            email,
            plan: PLANKS_KVP[planKey],
            amount: 100
        }, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET_KEY}` } })
        if (result.status === 200) {
            const data = result.data;
            if (data.status) {
                return data.data.authorization_url
            }
        }
        return ""
    } catch (error) {
        // console.log(error)
        return ""
    }
}

export const checkTxnExists = async (reference: string) => {
    const txn = await TransactionModel.findOne({ reference })
    if (txn) {
        return true
    }
    return false
}

// export const getPlanName = (key: string) => {
//     switch (key) {
//         case 'pro':
//             return 'Pro '
//             break;
    
//         default:
//             break;
//     }
// }