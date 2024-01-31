import mongoose from 'mongoose';
import { AppConfig } from '../../utilities/config';

const AccountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true, },
    password: { type: String, required: true, },
    verified: { type: Boolean, required: false, default: false },
    avatar: { type: String, required: false, default: '' },
    role: { type: Number, required: true, default: AppConfig.ACCOUNT_ROLES.USER, enum: Object.values(AppConfig.ACCOUNT_ROLES) },
    type: { type: Number, required: true, default: AppConfig.ACCOUNT_TYPES.DEFAULT, enum: Object.values(AppConfig.ACCOUNT_TYPES) },
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
