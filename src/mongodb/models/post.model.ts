import mongoose, { Schema } from 'mongoose';
import { fileSchema } from './file.model';

const PostSchema = new Schema({
    body: { type: String, required: true },
    attachments: { type: [fileSchema], default: [] },
    parentId: { type: Schema.Types.ObjectId, ref: 'Post', },
    comments: { type: [Schema.Types.ObjectId], ref: 'Post', },
    account: {
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

const CommentModel = mongoose.model('Post', PostSchema);

export default CommentModel;
