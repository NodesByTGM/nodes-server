import mongoose, { Schema } from 'mongoose';
import { AccountSchema } from './account.model';
import { fileSchema } from './file.model';

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    dateTime: { type: Date, required: true },
    workRate: { type: String, required: true },
    saves: { type: [AccountSchema], default: [] },
    thumbnail: { type: fileSchema, required: false, default: null },

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