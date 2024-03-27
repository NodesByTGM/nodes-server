import mongoose, { Schema } from 'mongoose';
import { AppConfig, JobType } from '../../utilities/config';
import { mongooseLeanId } from './plugin';

const JobSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    experience: { type: String, required: true },
    payRate: { type: String, required: true },
    workRate: { type: String, required: true },
    skills: { type: [String], required: true },
    jobType: { type: Number, required: true, enum: Object.values(AppConfig.JOB_TYPES) },
    applicants: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: 'Account',
        default: []
    },
    saves: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: 'Account',
        default: []
    },

    business: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Business',
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (_: any, rec: Record<string, any>) => {
            const { __v, _id, jobType, ...object } = rec;
            object.id = _id
            object.jobType = JobType[jobType]
            return object;
        }
    },
    // toObject: {
    //     transform: (_: any, rec: Record<string, any>) => {
    //         const { __v, _id, ...object } = rec;
    //         object.id = _id
    //         return object;
    //     }
    // }
});

JobSchema.plugin(mongooseLeanId);

const JobModel = mongoose.model('Job', JobSchema);

export default JobModel;
