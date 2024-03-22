import mongoose, { Schema } from 'mongoose';
import { AccountSchema } from './account.model';
import { fileSchema } from './file.model';

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    dateTime: { type: Date, required: true },
    paymentType: { type: String, required: true, enum: ['free', 'paid'] },
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
    }
});

const EventModel = mongoose.model('Event', EventSchema);

export default EventModel;
