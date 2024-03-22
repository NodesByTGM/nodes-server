import mongoose, { Schema } from 'mongoose';

const CommentSchema = new mongoose.Schema({
    body: { type: String, required: true },
    description: { type: String, required: true },
    business: {
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

const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;
