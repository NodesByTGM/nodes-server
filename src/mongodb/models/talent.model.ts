import mongoose, { Schema } from 'mongoose';

const TalentDetailsSchema = new mongoose.Schema({
    skills: { type: String, required: false, default: ''},
    onboardingPurpose: { type: Number, required: false, default: 0 },
    location: { type: String, required: false, default: '' },
    linkedIn: { type: String, required: false, default: '' },
    instagram: { type: String, required: false, default: '' },
    twitter: { type: String, required: false, default: '' },
    step: { type: Number, required: false, default: 0 },
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
