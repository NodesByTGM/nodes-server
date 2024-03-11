import mongoose from "mongoose";

export const fileSchema = new mongoose.Schema({
    id: { type: String, required: false, default:'' },
    url: { type: String, required: false, default:'' }
}, { _id: false })

// fileSchema.pre('save', async function (next) {
//     if (!this.id) {
//         this.id = ''
//     }
//     if (!this.url) {
//         this.url = ''
//     }
//     next();
// });