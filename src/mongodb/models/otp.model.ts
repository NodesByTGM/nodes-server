import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    used: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (_, rec) => {
            const { __v, _id, ...object } = rec;
            object.id = _id;
            return object;
        }
    }
});

// OTPSchema.index({ email: 1, password: 1 }, { unique: true });

const OTPModel = mongoose.model('OTP', OTPSchema);

export default OTPModel