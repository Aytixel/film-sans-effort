function getFavoritePipeline(_id) {
    return [
        { $match: { _id } },
        { $lookup: { from: "movie", localField: "favorite", foreignField: "_id", as: "favorite" } },
        { $unwind: { path: "$favorite", preserveNullAndEmptyArrays: false } },
        { $replaceRoot: { newRoot: "$favorite" } },
    ]
}

function getRecommandationPipeline(_id) {
    return [
        { $match: { _id } },
        { $lookup: { from: "movie", localField: "favorite", foreignField: "_id", as: "favorite_" } },
        { $unwind: { path: "$favorite_", preserveNullAndEmptyArrays: false } },
        { $group: { _id: "$_id", favorite: { $first: "$favorite" }, genre: { $addToSet: "$favorite_.genre" }, staff: { $addToSet: "$favorite_.staff" } } },
        { $unwind: { path: "$genre" } },
        { $unwind: { path: "$genre" } },
        { $group: { _id: "$_id", favorite: { $first: "$favorite" }, genre: { $addToSet: "$genre" }, staff: { $first: "$staff" } } },
        { $unwind: { path: "$staff" } },
        { $unwind: { path: "$staff" } },
        { $group: { _id: "$_id", favorite: { $first: "$favorite" }, genre: { $first: "$genre" }, staff: { $addToSet: "$staff" } } },
        {
            $lookup: {
                from: "movie",
                let: { favorite: "$favorite", staff: "$staff", genre: "$genre" },
                pipeline: [
                    { $addFields: { score: { $size: { $concatArrays: [{ $setIntersection: ["$staff", "$$staff"] }, { $setIntersection: ["$genre", "$$genre"] }] } } } },
                    { $match: { $expr: { $not: [{ $in: ["$_id", "$$favorite"] }] }, score: { $gt: 0 } } }
                ],
                as: "movie",
            },
        },
        { $unwind: { path: "$movie" } },
        { $replaceRoot: { newRoot: "$movie" } },
        { $sort: { score: -1 } }
    ]
}

export { getFavoritePipeline };