import mongoose, { Schema } from 'mongoose';
import { mongooseLeanId } from './plugin';

export const BusinessSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedIn: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    yoe: { type: Date, default: Date.now() },
    verified: { type: Boolean, default: false },
    cac: { type: Schema.Types.ObjectId, ref: 'File', autopopulate: true },
    logo: { type: Schema.Types.ObjectId, ref: 'File', autopopulate: true },
    verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    account: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (_: any, rec: Record<string, any>) => {
            const { __v, _id, ...object } = rec;
            object.id = _id
            return object;
        }
    }
});

BusinessSchema.plugin(mongooseLeanId);
BusinessSchema.plugin(require('mongoose-autopopulate'));
const BusinessModel = mongoose.model('Business', BusinessSchema);

export default BusinessModel;
