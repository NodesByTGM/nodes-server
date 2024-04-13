import mongoose, { Schema } from 'mongoose';
import { fileSchema } from './file.model';
import { mongooseLeanId } from './plugin';

export const BusinessSchema = new mongoose.Schema({
    name: { type: String },
    logo: fileSchema,
    yoe: { type: Date, default: Date.now() },
    verified: { type: Boolean, default: false },
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
