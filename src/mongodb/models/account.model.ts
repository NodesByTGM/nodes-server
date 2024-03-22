import mongoose from 'mongoose';
import { AppConfig } from '../../utilities/config';
import { fileSchema } from './file.model';
import { SubscriptionSchema } from './subscription.model';
import { BusinessSchema } from './business.model';

export const AccountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true, },
    password: { type: String, required: true, },
    verified: { type: Boolean, required: false, default: false },
    avatar: { type: fileSchema, required: false, default: null },

    skills: { type: [String], required: false, default: '' },
    location: { type: String, required: false, default: '' },
    linkedIn: { type: String, required: false, default: '' },
    instagram: { type: String, required: false, default: '' },
    twitter: { type: String, required: false, default: '' },
    step: { type: Number, required: false, default: 0 },
    onboardingPurpose: { type: Number, required: false, default: 0 },
    otherPurpose: { type: String, required: false, default: '' },

    height: { type: String, required: false, default: '' },
    age: { type: String, required: false, default: '' },

    headline: { type: String, required: false, default: '' },
    bio: { type: String, required: false, default: '' },
    website: { type: String, required: false, default: '' },
    spaces: { type: Boolean, required: false, default: false },
    comments: { type: Boolean, required: false, default: false },
    visible: { type: Boolean, required: false, default: true },


    subscription: { type: SubscriptionSchema, default: null },
    business: { type: BusinessSchema, default: null },

    role: {
        type: Number,
        required: true,
        default: AppConfig.ACCOUNT_ROLES.USER,
        enum: Object.values(AppConfig.ACCOUNT_ROLES)
    },
    type: {
        type: Number,
        required: true,
        default: AppConfig.ACCOUNT_TYPES.DEFAULT,
        enum: Object.values(AppConfig.ACCOUNT_TYPES)
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (_: any, rec: Record<string, any>) => {
            const { __v, _id, password, role, ...object } = rec;
            object.id = _id
            return object;
        }
    }
});

// AccountSchema.index({ anime: 1, character: 1 })
// AccountSchema.index({ charcter: 1, quote: 1 }, { unique: true });

const AccountModel = mongoose.model('Account', AccountSchema);

export default AccountModel;
