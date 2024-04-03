import mongoose, { Schema } from 'mongoose';
import { fileSchema } from './file.model';
import { mongooseLeanId } from './plugin';

const MemberSchema = new Schema({
    account: { type: Schema.Types.ObjectId, required: true, ref: 'Account', autopopulate: { select: 'id name avatar' } },
    status: { type: String, default: 'Member' }

})

const SpaceSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: fileSchema, default: null },
    rules: { type: [String], required: false, default: [] },
    // admins: { type: [Schema.Types.ObjectId], ref: 'Account', default: [], autopopulate: { select: 'id name avatar' } },
    members: { type: [Schema.Types.ObjectId], ref: 'Account', default: [], autopopulate: { select: 'id name avatar' } },
    followers: { type: [Schema.Types.ObjectId], ref: 'Account', default: [], autopopulate: { select: 'id name avatar' } },
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'Account', autopopulate: { select: 'id name avatar' } },
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
SpaceSchema.plugin(require('mongoose-autopopulate'));
// SpaceSchema.plugin(mongooseLeanId);
const SpaceModel = mongoose.model('Space', SpaceSchema);

export default SpaceModel;
