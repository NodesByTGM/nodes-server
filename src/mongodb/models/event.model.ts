import mongoose, { Schema } from 'mongoose';
import { AccountSchema } from './account.model';
import { fileSchema } from './file.model';
import { mongooseLeanId } from './plugin';

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    dateTime: { type: Date, required: true },
    paymentType: { type: String, required: false, enum: ['free', 'paid'], default: 'free' },
    thumbnail: { type: fileSchema, required: false, default: null },
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
            const { __v, _id, ...object } = rec;
            object.id = _id
            return object;
        }
    },
    toObject: {
        transform: (_: any, rec: Record<string, any>) => {
            const { __v, _id, ...object } = rec;
            object.id = _id
            return object;
        }
    }
});

EventSchema.plugin(mongooseLeanId);

const EventModel = mongoose.model('Event', EventSchema);

export default EventModel;
