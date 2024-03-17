import mongoose, { Schema } from 'mongoose';
import { fileSchema } from './file.model';

export const BusinessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: fileSchema,
    yoe: { type: Date, required: true },
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

const BusinessModel = mongoose.model('Business', BusinessSchema);

export default BusinessModel;
