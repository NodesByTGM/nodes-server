import mongoose, { Schema } from 'mongoose';

const collaborator = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    projectURL: { type: String, required: true },
    thumbnail: { type: Schema.Types.ObjectId, ref: 'File', autopopulate: true },
    images: { type: [Schema.Types.ObjectId], ref: 'File', autopopulate: true },
    collaborators: [collaborator],
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
        // autopopulate: { select: ['id', 'name', 'type', 'email', 'headline', 'bio', 'avatar'] }
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
// ProjectSchema.plugin(require('mongoose-autopopulate'));
const ProjectModel = mongoose.model('Project', ProjectSchema);

export default ProjectModel;
