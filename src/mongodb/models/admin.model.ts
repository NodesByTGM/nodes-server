import mongoose from 'mongoose';
import { AppConfig } from '../../utilities/config';
import { fileSchema } from './file.model';

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    verified: { type: Boolean, required: false, default: false },
    avatar: { type: fileSchema, required: false, default: null },
    role: {
        type: Number,
        required: true,
        default: AppConfig.ADMIN_ROLES.MEMBER,
        enum: Object.values(AppConfig.ADMIN_ROLES)
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (_: any, rec: Record<string, any>) => {
            const { __v, _id, password, ...object } = rec;
            object.id = _id
            return object;
        }
    }
});

const AdminModel = mongoose.model('Admin', AdminSchema);


export default AdminModel;
