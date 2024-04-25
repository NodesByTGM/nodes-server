import { EventModel } from "../mongodb/models";

export const getUserEvents = async (user: any, reqUser: any) => {
    const business = user.business
    // const userId = user.id.toString()
    // TODO HIDE BASED ON OWNER
    const reqUserId = reqUser.id.toString()
    const events = await EventModel.aggregate([
        { $match: { business: business?._id || '' } },
        { $sort: { createdAt: -1 } },
        {
            $addFields: {
                saved: {
                    $in: [reqUserId, { $map: { input: "$saves", as: "saved", in: { $toString: "$$saved" } } }]
                }
            }
        },
        { $addFields: { id: "$_id" } },
        { $unset: ["_id", "__v"] }
    ]);
    await EventModel.populate(events, [
        { path: 'saves', select: 'id name email type headline bio avatar', options: { autopopulate: false } },
        { path: 'business' },
    ]);

    return events
}

export default {
    getUserEvents
}