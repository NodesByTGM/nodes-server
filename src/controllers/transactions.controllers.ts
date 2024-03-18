import { RequestHandler } from 'express';
import { PaystackWebhookEvent } from '../interfaces/paystack';
import { AccountModel, SubscriptionModel, TransactionModel } from '../mongodb/models';
import { addSubscription, sendEmail, verifyTxnByReference } from '../services';
import { sendHTMLEmail } from '../services/email.service';
import { addYearsToDate, formatDate, verifyTransaction } from '../utilities/common';
import { AppConfig } from '../utilities/config';

export const verifyTransactionController: RequestHandler = async (req, res) => {
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

export const verifyInternalTransactionController: RequestHandler = async (req: any, res) => {
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
        // const data = await getUserFullProfile(req.user)
        return res.json({ message: AppConfig.STRINGS.Success, data: req.user })
    } catch (error) {
        return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError })
    }
}

export const paystackWebhookController: RequestHandler = async (req, res) => {
    const eventData: PaystackWebhookEvent = req.body;
    const signature = req.headers['x-paystack-signature'];
    // console.log(eventData)

    if (!verifyTransaction(eventData, signature)) {
        return res.sendStatus(400);
    }

    if (eventData.event === 'charge.success') {
        const { data } = eventData
        // socketServer.emit('payment_success', { email: data.customer.email })
        // const transactionId = data.id;
        // Process the successful transaction to maybe fund wallet and update your WalletModel
        // console.log(`Transaction ${transactionId} was successful`);
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
            user.subscription = sub
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

    return res.sendStatus(200);
    // TODO: should it send back a fail to paystack when the system itself fails and not because it didnt recieve somethnig right?
    // Change the paystack pop up flow
}

export const subscribeToPackage: RequestHandler = async (req: any, res) => {
    try {
        const authorizationURL = await addSubscription(req.user.email, req.params.planKey)
        if (authorizationURL) {
            return res.json({ message: AppConfig.STRINGS.Success, authorizationURL })
        }
        return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.BadRequestError })
    } catch (error) {
        return res.status(500).json({ message: AppConfig.ERROR_MESSAGES.InternalServerError })
    }
}