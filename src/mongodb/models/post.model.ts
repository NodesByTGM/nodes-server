import mongoose, { Schema } from 'mongoose';
import { AppConfig } from '../../utilities/config';
import { fileSchema } from './file.model';

const PostSchema = new Schema({
    body: { type: String, required: true },
    attachments: { type: [fileSchema], default: [] },
    hashtags: { type: [String], required: false, default: [] },
    foreignKey: { type: String },
    type: { type: String, enum: Object.values(AppConfig.POST_TYPES), default: AppConfig.POST_TYPES.Community },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Post', default: null
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'Account', default: []
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'Post', default: [], autopopulate: { maxDepth: 1 }
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true, ref: 'Account', autopopulate: { select: ['name', 'id', 'avatar'] }
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
PostSchema.plugin(require('mongoose-autopopulate'));
// PostSchema.plugin(mongooseLeanId);
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
