import mongoose, { Schema } from 'mongoose';
import { fileSchema } from './file.model';

const BusinessDetailsSchema = new mongoose.Schema({
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

const BusinessDetailsModel = mongoose.model('BusinessDetails', BusinessDetailsSchema);

export default BusinessDetailsModel;
