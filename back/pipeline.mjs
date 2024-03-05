function getFavoritePipeline(_id) {
    return [
        { $match: { _id } },
        { $lookup: { from: "movie", localField: "favorite", foreignField: "_id", as: "favorite" } },
        { $unwind: { path: "$favorite", preserveNullAndEmptyArrays: false } },
        { $replaceRoot: { newRoot: "$favorite" } },
    ]
}

export { getFavoritePipeline };