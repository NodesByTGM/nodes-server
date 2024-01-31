import mongoose, { Schema } from 'mongoose';

const BusinessDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true },
    website: { type: String, required: true },
    industry: { type: String, required: true },
    tagline: { type: String, required: true },
    size: { type: String, required: true },
    type: { type: String, required: true },
    profession: { type: String, required: true },
    location: { type: String, required: true },
    linkedIn: { type: String, required: false, default: '' },
    instagram: { type: String, required: false, default: '' },
    twitter: { type: String, required: false, default: '' },
    accountId: {
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
