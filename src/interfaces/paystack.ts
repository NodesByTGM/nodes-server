export interface InitiateTransactionResult {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}
export interface ChargeSuccessEventData {
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
}

export interface PaystackWebhookEvent {
    event: string;
    data: any;
    // data: ChargeSuccessEventData | SubscriptionDisabledEventData;
}


export interface PaystackVerifiedTransaction {
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

export interface SubscriptionDisabledEventData {
    domain: string;
    status: string;
    subscription_code: string;
    email_token: string;
    amount: number;
    cron_expression: string;
    next_payment_date: string;
    open_invoice?: any;
    plan: {
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
    customer: {
        first_name: string;
        last_name: string;
        email: string;
        customer_code: string;
        phone: string;
        metadata: Metadata;
        risk_action: string;
    };
    created_at: string;
};

interface Metadata { }
interface Split { }