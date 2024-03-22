// import mongoose from 'mongoose';

// const MovieSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
// }, {
//     timestamps: true,
//     toJSON: {
//         transform: (_: any, rec: Record<string, any>) => {
//             const { __v, _id, ...object } = rec;
//             object.id = _id
//             return object;
//         }
//     }
// });

// const MovieModel = mongoose.model('Movie', MovieSchema);

// export default MovieModel;
