import mongoose, { Schema } from 'mongoose';
import { fileSchema } from './file.model';
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
    logo: { type: fileSchema, default: null },
    cac: { type: fileSchema, default: null },
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

const BusinessModel = mongoose.model('Business', BusinessSchema);

export default BusinessModel;
