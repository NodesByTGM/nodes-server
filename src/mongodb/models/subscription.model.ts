import { Schema, model } from 'mongoose';

export const SubscriptionSchema = new Schema({
    plan: { type: String, required: true },
    active: { type: Boolean, required: true, default: false },
    // status: { type: Boolean, required: true, default: false }, in case of refunds
    paidAt: { type: Date, required: false },
    account: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (_: any, rec: Record<string, any>) => {
            const { __v, _id, account, ...object } = rec;
            object.id = _id
            return object;
        }
    }
});


const SubscriptionModel = model('Subscription', SubscriptionSchema);

export default SubscriptionModel;
