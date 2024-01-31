import mongoose, { Schema } from 'mongoose';

const TalentDetailsSchema = new mongoose.Schema({
    skills: { type: String, required: true },
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

const TalentDetailsModel = mongoose.model('TalentDetails', TalentDetailsSchema);

export default TalentDetailsModel;
