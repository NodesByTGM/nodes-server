import mongoose, { Schema } from 'mongoose';
import { AppConfig } from '../../utilities/config';

const ContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true, },
    thumbnail: { type: Schema.Types.ObjectId, ref: 'File', autopopulate: true },
    category: {
        type: String,
        required: true,
        enum: Object.values(AppConfig.CONTENT_CATEGORIES)
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(AppConfig.CONTENT_STATUSES),
        default: AppConfig.CONTENT_STATUSES.Draft
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Admin',
        autopopulate: { select: ['name', 'id', 'avatar'] }
    }
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

ContentSchema.plugin(require('mongoose-autopopulate'));
const ContentModel = mongoose.model('Content', ContentSchema);


export default ContentModel;
