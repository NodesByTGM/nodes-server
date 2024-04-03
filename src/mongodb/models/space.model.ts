import mongoose, { Schema } from 'mongoose';
import { fileSchema } from './file.model';
import { mongooseLeanId } from './plugin';
import { AppConfig } from '../../utilities/config';

// export interface ISpace extends Document {
//     name: string;
//     description: string;
//     thumbnail: {
//         id: string,
//         url: string
//     } | null;
//     rules: string[];
//     members: {
//         account: Schema.Types.ObjectId,
//         status: string,
//         dateJoined: any
//     }[];
//     owner: Schema.Types.ObjectId;
//     isMember: (accountId: string) => boolean;
// }

const MemberSchema = new Schema({
    account: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
    status: { type: Number, default: AppConfig.MEMBER_TYPES.Member, enum: Object.values(AppConfig.MEMBER_TYPES) },
    dateJoined: { type: Date, default: Date.now() }

}, { _id: false })

MemberSchema.plugin(require('mongoose-autopopulate'));

const SpaceSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: fileSchema, default: null },
    rules: { type: [String], required: false, default: [] },
    members: { type: [MemberSchema], default: [] },
    // followers: { type: [Schema.Types.ObjectId], ref: 'Account', default: [] },
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
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

// SpaceSchema.methods.isMember = function () {
//     // Access the document fields using 'this'
//     this,members
// };

SpaceSchema.plugin(require('mongoose-autopopulate'));
// SpaceSchema.plugin(mongooseLeanId);
const SpaceModel = mongoose.model('Space', SpaceSchema);

export default SpaceModel;
