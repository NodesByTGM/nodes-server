import mongoose, { Schema } from 'mongoose';
import { fileSchema } from './file.model';
import { mongooseLeanId } from './plugin';

const PostSchema = new Schema({
    body: { type: String, required: true },
    attachments: { type: [fileSchema], default: [] },
    hashtags: { type: [String], required: false, default: [] },
    parent: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
    likes: { type: [Schema.Types.ObjectId], ref: 'Account', default: [] },
    comments: { type: [Schema.Types.ObjectId], ref: 'Post', autopopulate: true, default: [] },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'Account', autopopulate: true },
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
