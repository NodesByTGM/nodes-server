import mongoose from 'mongoose';

const connectDB = () => {
  mongoose.set('strictQuery', true);
  const dbUrl = `${process.env.MONGODB_URI}`
  mongoose.connect(dbUrl, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    connectTimeoutMS: 5000, // Timeout after 5 seconds
    // keepAlive: true, // Enable keep-alive
  })
    .then(() => console.log('[db]: Connected to MongoDB'))
    .catch((err) => {
      console.error('[error]: Failed to connect to MongoDB');
      console.error(err);
    });
};

export default connectDB;


// await mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// });
