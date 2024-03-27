// const jobs = await JobModel.aggregate([
//     { $match: { business } },
//     {
//       $lookup: {
//         from: "businesses",
//         localField: "business",
//         foreignField: "_id",
//         as: "business"
//       }
//     },
//     {
//       $lookup: {
//         from: "users",  // Assuming saves and applicants reference the users collection
//         localField: "saves",
//         foreignField: "_id",
//         as: "saves"
//       }
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "applicants",
//         foreignField: "_id",
//         as: "applicants"
//       }
//     },
//     {
//       $addFields: {
//         business: { $arrayElemAt: ["$business", 0] }, // Deconstructing the array
//         applied: {
//           $in: [mongoose.Types.ObjectId(req.user.id), "$applicants._id"]
//         },
//         saved: {
//           $in: [mongoose.Types.ObjectId(req.user.id), "$saves._id"]
//         }
//       }
//     },
//     {
//       $project: {
//         business: 0, // Exclude business field if not needed
//         saves: 0,    // Exclude saves field if not needed
//         applicants: 0 // Exclude applicants field if not needed
//       }
//     },
//     { $unwind: "$business" } // Unwind the business field
//   ]);
  
//   // If you want to convert the ObjectId to string in JavaScript, you can map through the jobs array
//   const jobsWithAppliedAndSaved = jobs.map(job => ({
//     ...job,
//     applied: job.applied.toString(),
//     saved: job.saved.toString()
//   }));
  
//   // jobsWithAppliedAndSaved now contains the jobs array with applied and saved fields converted to string
  