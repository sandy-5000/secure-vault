import mongoose, { Schema } from "mongoose"

const fileSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
        maxlength: 40
    },
    directory: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String,
        default: 'no-link',
    },
    parent: {
        type: Schema.Types.ObjectId,
    },
    children: {
        type: [{
            name: {
                type: String,
                required: true,
            },
            _id: {
                type: Schema.Types.ObjectId,
                required: true,
            },
        }],
        default: [],
    },
    location: {
        type: String,
        required: true,
    },
})

fileSchema.index({ user_id: 1, group_id: 1, location: 1 }, { unique: true })
fileSchema.index({ group_id: 1, user_id: 1, location: 1 }, { unique: true })
fileSchema.index({ name: 1 })

export default mongoose.model("file", fileSchema)