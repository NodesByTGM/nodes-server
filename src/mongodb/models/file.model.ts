import mongoose from "mongoose";
import { CloudinaryService } from "../../services";

interface IFile extends Document {
    id: string;
    url: string;
}


export const FileSchema = new mongoose.Schema({
    id: { type: String, required: false, default: '', unique:true },
    url: { type: String, required: false, default: '' }
}, {
    id: false,
    timestamps: true,
    toJSON: {
        transform: (_: any, rec: Record<string, any>) => {
            const { __v, ...object } = rec;

            return object;
        }
    }
})

FileSchema.pre('deleteOne', async function (next) {
    const doc: any = this;
    try {
        if (doc?.id) {
            await CloudinaryService.deleteMedia(doc.id)
        }
    } catch (error) { }
    next();
});

const FileModel = mongoose.model('File', FileSchema);
export default FileModel