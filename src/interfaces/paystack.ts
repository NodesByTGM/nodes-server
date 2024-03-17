export interface InitiateTransactionResult {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}
export interface IPaystackPayment {
    status: boolean;
    message: string;
    data?: {
        id: number;
        domain: string;
        status: string;
        reference: string;
        amount: number;
        message?: any;
        gateway_response: string;
        paid_at: string;
        created_at: string;
        channel: string;
        currency: string;
        ip_address: string;
        metadata: string;
        log: {
            type: string;
            message: string;
            time: number;
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
        };
        customer: {
            id: number;
            first_name?: any;
            last_name?: any;
            email: string;
            customer_code: string;
            phone?: any;
            metadata?: any;
            risk_action: string;
            international_format_phone?: any;
        };
        plan?: any;
        split: Split;
        order_id?: any;
        paidAt: string;
        createdAt: string;
        requested_amount: number;
        pos_transaction_data?: any;
        source?: any;
        fees_breakdown?: any;
        transaction_date: string;
        plan_object: Split;
        subaccount: Split;
    };
}
interface Split {
}

export interface ChargeSuccessEvent {
    event: string;
    data: {
        id: number;
        domain: string;
        status: string;
        reference: string;
        amount: number;
        message?: any;
        gateway_response: string;
        paid_at: string;
        created_at: string;
        channel: string;
        currency: string;
        ip_address: string;
        metadata: number;
        log: {
            time_spent: number;
            attempts: number;
            authentication: string;
            errors: number;
            success: boolean;
            mobile: boolean;
            input: any[];
            channel?: any;
            history: History[];
        }
        ;
        fees?: any;
        customer: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            customer_code: string;
            phone?: any;
            metadata?: any;
            risk_action: string;
        }
        ;
        authorization: {
            authorization_code: string;
            bin: string;
            last4: string;
            exp_month: string;
            exp_year: string;
            card_type: string;
            bank: string;
            country_code: string;
            brand: string;
            account_name: string;
        };
        plan: {};
    };
}






export interface PaystackWebhookEvent {
    event: string;
    data: {
        id: number;
        domain: string;
        status: string;
        reference: string;
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
        fees_breakdown?: any;
        log?: any;
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
        plan: {
            id: number;
            name: string;
            plan_code: string;
            description?: any;
            amount: number;
            interval: string;
            send_invoices: number;
            send_sms: number;
            currency: string;
        };
        subaccount: {};
        split: {};
        order_id?: any;
        paidAt: string;
        requested_amount: number;
        pos_transaction_data?: any;
        source: {
            type: string;
            source: string;
            entry_point: string;
            identifier?: any;
        };
    };
}


const r = {
    "status": true,
    "message": "Verification successful",
    "data": {
        "id": 2009945086,
        "domain": "test",
        "status": "success",
        "reference": "rd0bz6z2wu",
        "amount": 20000,
        "message": null,
        "gateway_response": "Successful",
        "paid_at": "2022-08-09T14:21:32.000Z",
        "created_at": "2022-08-09T14:20:57.000Z",
        "channel": "card",
        "currency": "NGN",
        "ip_address": "100.64.11.35",
        "metadata": "",
        "log": {
            "start_time": 1660054888,
            "time_spent": 4,
            "attempts": 1,
            "errors": 0,
            "success": true,
            "mobile": false,
            "input": [],
            "history": [
                {
                    "type": "action",
                    "message": "Attempted to pay with card",
                    "time": 3
                },
                {
                    "type": "success",
                    "message": "Successfully paid with card",
                    "time": 4
                }
            ]
        },
        "fees": 100,
        "fees_split": null,
        "authorization": {
            "authorization_code": "AUTH_ahisucjkru",
            "bin": "408408",
            "last4": "4081",
            "exp_month": "12",
            "exp_year": "2030",
            "channel": "card",
            "card_type": "visa ",
            "bank": "TEST BANK",
            "country_code": "NG",
            "brand": "visa",
            "reusable": true,
            "signature": "SIG_yEXu7dLBeqG0kU7g95Ke",
            "account_name": null
        },
        "customer": {
            "id": 89929267,
            "first_name": null,
            "last_name": null,
            "email": "hello@email.com",
            "customer_code": "CUS_i5yosncbl8h2kvc",
            "phone": null,
            "metadata": null,
            "risk_action": "default",
            "international_format_phone": null
        },
        "plan": null,
        "split": {},
        "order_id": null,
        "paidAt": "2022-08-09T14:21:32.000Z",
        "createdAt": "2022-08-09T14:20:57.000Z",
        "requested_amount": 20000,
        "pos_transaction_data": null,
        "source": null,
        "fees_breakdown": null,
        "transaction_date": "2022-08-09T14:20:57.000Z",
        "plan_object": {},
        "subaccount": {}
    }
}

const m = {
    "event": "charge.success",
    "data": {
        "id": 3557035194,
        "domain": "test",
        "status": "success",
        "reference": "T921832543445800",
        "amount": 80000000,
        "message": "test-3ds",
        "gateway_response": "[Test] Approved",
        "paid_at": "2024-02-17T23:00:58.000Z",
        "created_at": "2024-02-17T23:00:53.000Z",
        "channel": "card",
        "currency": "NGN",
        "ip_address": "102.88.36.35",
        "metadata": {
            "referrer": "http://localhost:5173/purchase-summary/aspiring-entrepreneur"
        },
        "fees_breakdown": null,
        "log": null,
        "fees": 200000,
        "fees_split": null,
        "authorization": {
            "authorization_code": "AUTH_t773qktic3",
            "bin": "408408",
            "last4": "0409",
            "exp_month": "01",
            "exp_year": "2030",
            "channel": "card",
            "card_type": "visa ",
            "bank": "TEST BANK",
            "country_code": "NG",
            "brand": "visa",
            "reusable": true,
            "signature": "SIG_iyPPqhzWkULvi6STOFD5",
            "account_name": null,
            "receiver_bank_account_number": null,
            "receiver_bank": null
        },
        "customer": {
            "id": 154595893,
            "first_name": "",
            "last_name": "",
            "email": "elijahsoladoye@rocketmail.com",
            "customer_code": "CUS_wfnnlnfqgc8lk44",
            "phone": "",
            "metadata": null,
            "risk_action": "default",
            "international_format_phone": null
        },
        "plan": {
            "id": 1151971,
            "name": "Aspiring Entrepreneur",
            "plan_code": "PLN_ynai94hy9vcwkw9",
            "description": null,
            "amount": 80000000,
            "interval": "annually",
            "send_invoices": 1,
            "send_sms": 1,
            "currency": "NGN"
        },
        "subaccount": {},
        "split": {},
        "order_id": null,
        "paidAt": "2024-02-17T23:00:58.000Z",
        "requested_amount": 80000000,
        "pos_transaction_data": null,
        "source": {
            "type": "web",
            "source": "checkout",
            "entry_point": "request_inline",
            "identifier": null
        }
    }
}