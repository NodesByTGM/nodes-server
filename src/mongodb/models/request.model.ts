import mongoose, { Schema } from 'mongoose';
import { AppConfig } from '../../utilities/config';

const ConnectionRequest = new mongoose.Schema({
    message: { type: String, default: '' },
    status: {
        type: String,
        enum: Object.values(AppConfig.CONNECTION_REQUEST_STATUS),
        default: AppConfig.CONNECTION_REQUEST_STATUS.Pending
    },
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Admin',
        autopopulate: { select: ['id', 'name', 'type', 'email', 'headline', 'bio', 'avatar'] }
    },
    recipient: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Admin',
        autopopulate: { select: ['id', 'name', 'type', 'email', 'headline', 'bio', 'avatar'] }
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

ConnectionRequest.plugin(require('mongoose-autopopulate'));
const ConnectionRequestModel = mongoose.model('ConnectionRequest', ConnectionRequest);


export default ConnectionRequestModel;
