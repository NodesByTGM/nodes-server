import mongoose from 'mongoose';
import { AppConfig } from '../../utilities/config';
import { fileSchema } from './file.model';

const AdminSchema = new mongoose.Schema({
    cid: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    verified: { type: Boolean, required: false, default: false },
    role: {
        type: Number,
        required: true,
        default: AppConfig.ACCOUNT_ROLES.ADMIN,
        enum: Object.values(AppConfig.ACCOUNT_ROLES)
    },

    headshot: fileSchema,
}, {
    timestamps: true,
    toJSON: {
        transform: (_: any, rec: Record<string, any>) => {
            const { __v, _id, password, cid, role, ...object } = rec;
            object.id = _id
            object.cid = `GT-${String(cid).padStart(8, '0')}`
            return object;
        }
    }
});

// AccountSchema.pre('save', async function (next) {
//     if (!this.cid) {
//         const lastAccount = await AccountModel.findOne({}, {}, { sort: { cid: -1 } });
//         if (lastAccount) {
//             this.cid = lastAccount ? lastAccount.cid + 1 : 1;
//         } else {
//             this.cid = 0
//         }
//     }
//     next();
// });


// AccountSchema.index({ anime: 1, character: 1 })
// AccountSchema.index({ charcter: 1, quote: 1 }, { unique: true });

const AdminModel = mongoose.model('Admin', AdminSchema);


export default AdminModel;
