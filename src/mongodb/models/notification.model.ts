import mongoose, { Schema } from 'mongoose';
import { mongooseLeanId } from './plugin';
import { AppConfig } from '../../utilities/config';

export const NotificationSchema = new mongoose.Schema({
    message: { type: String, default: '' },
    foreignKey: { type: String, default: '', enum: Object.values(AppConfig.NOTIFICATION_TYPES) },
    type: { type: String, default: '' },
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

NotificationSchema.plugin(mongooseLeanId);

const NotificationModel = mongoose.model('Notification', NotificationSchema);

export default NotificationModel;
