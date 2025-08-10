import mongoose, { Schema } from "mongoose";
import mongooseagreegatepaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String, //cloudinary
        required: true,
    },
    thubnail: {
        type: String, //cloudinary
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,  // cloudnary
        required: true,
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: true,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

// helps in mongoose agregation pipeline
videoSchema.plugin(mongooseagreegatepaginate);

export const Video = mongoose.model('Video', videoSchema);