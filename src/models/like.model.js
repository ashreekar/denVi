import mongoose, { Mongoose, Schema } from "mongoose";

const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            reference: "Video"
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            reference: "User"
        },
        comment: {
            type: Schema.Types.ObjectId,
            reference: "Comment"
        },
        tweet: {
            type: Schema.Types.ObjectId,
            reference: "Tweet"
        }
    },
    {
        timestamps: true
    }
)

export const Like = mongoose.model("Like", likeSchema)